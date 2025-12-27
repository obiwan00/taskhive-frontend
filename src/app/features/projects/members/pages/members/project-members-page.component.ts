import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';

import { catchError, EMPTY, filter, of, switchMap, tap } from 'rxjs';

import { AppNavRoutes } from '@core/navigation-routes';
import { UserService } from '@core/user';
import {
  ProjectPermission,
  ProjectPermissionService,
  ProjectRole,
  ProjectRoleComponent,
  ProjectStateService
} from '@features/projects/project';
import { InvokePipe } from '@shared/pipes';
import {
  ConfirmationDialogComponent,
  ConfirmDialogData,
  InfoBlockComponent,
  UserInfoComponent
} from '@shared/ui';

import { ProjectMembersApiService } from '../../api';
import {
  AddProjectMemberDialogComponent,
  EditProjectMemberDialogComponent,
  EditProjectMemberDialogData
} from '../../components';
import { AddProjectMember, ProjectMember, UpdateProjectMember } from '../../models';

interface MembersState {
  members: ProjectMember[];
  loading: boolean;
  updating: boolean;
  error: string | null;
}

@Component({
  selector: 'app-project-members-page',
  templateUrl: './project-members-page.component.html',
  styleUrl: './project-members-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    InfoBlockComponent,
    ProjectRoleComponent,
    UserInfoComponent,
    InvokePipe
  ]
})
export class ProjectMembersPageComponent implements OnInit {
  private readonly membersApi = inject(ProjectMembersApiService);
  private readonly projectStateService = inject(ProjectStateService);
  private readonly permissionService = inject(ProjectPermissionService);
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private readonly projectId = computed(() => {
    const id = this.route.snapshot.paramMap.get('projectId');
    if (!id) throw new Error('projectId route param is required');
    return id;
  });

  protected readonly userProfile = this.userService.profile;

  protected readonly ProjectRole = ProjectRole;
  protected readonly ProjectPermission = ProjectPermission;

  protected readonly state = signal<MembersState>({
    members: [],
    loading: false,
    updating: false,
    error: null
  });

  protected readonly maxMembersCount = 16;
  protected readonly members = computed(() => this.state().members);
  protected readonly loading = computed(() => this.state().loading);
  protected readonly updating = computed(() => this.state().updating);
  protected readonly error = computed(() => this.state().error);

  protected readonly projectRole = computed(() => this.projectStateService.project()?.myRole);

  protected readonly canAddMember = computed(() => {
    const role = this.projectRole();
    return role ? this.permissionService.hasPermission(role, ProjectPermission.AddProjectMember) : false;
  });

  protected readonly canUpdateMemberRole = computed(() => {
    const role = this.projectRole();
    return role ? this.permissionService.hasPermission(role, ProjectPermission.UpdateProjectMemberRole) : false;
  });

  protected readonly canRemoveMember = computed(() => {
    const role = this.projectRole();
    return role ? this.permissionService.hasPermission(role, ProjectPermission.RemoveProjectMember) : false;
  });

  protected readonly maxMembersReached = computed(() => this.members().length >= this.maxMembersCount);

  protected readonly addButtonTooltip = computed(() => {
    if (!this.canAddMember()) {
      return 'You do not have permission to add members';
    }
    if (this.maxMembersReached()) {
      return `Maximum number of members (${this.maxMembersCount}) reached`;
    }
    return '';
  });

  protected readonly infoBlockMessage = computed(() => {
    if (this.canAddMember()) {
      return `Project must have at least one owner. Max members number is ${this.maxMembersCount}`;
    }
    return 'Reach project owners to add new project members';
  });

  protected readonly ownerCount = computed(() =>
    this.members().filter(m => m.role === ProjectRole.Owner).length
  );

  protected readonly displayedColumns = ['name', 'role', 'actions'];

  ngOnInit(): void {
    this.loadMembers();
    this.loadProjectDetails();
  }

  protected onAddMember(): void {
    const dialogRef = this.dialog.open<AddProjectMemberDialogComponent, void, AddProjectMember>(
      AddProjectMemberDialogComponent,
      {
        width: '500px'
      }
    );

    dialogRef.afterClosed()
      .pipe(
        filter((result): result is AddProjectMember => !!result),
        tap(() => this.state.update(s => ({ ...s, updating: true }))),
        switchMap(addData => this.membersApi.add(this.projectId(), addData)),
        catchError(error => {
          const errorMessage = error?.error?.detail || 'Failed to add member';
          this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
          this.state.update(s => ({ ...s, updating: false }));
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.loadMembers();
        this.snackBar.open('Member added successfully', 'Close', { duration: 3000 });
      });
  }

  protected onEditMember(member: ProjectMember): void {
    const dialogRef = this.dialog.open<EditProjectMemberDialogComponent, EditProjectMemberDialogData, UpdateProjectMember>(
      EditProjectMemberDialogComponent,
      {
        width: '550px',
        data: { member }
      }
    );

    dialogRef.afterClosed()
      .pipe(
        filter((result): result is UpdateProjectMember => !!result),
        tap(() => this.state.update(s => ({ ...s, updating: true }))),
        switchMap(updateData => this.membersApi.update(this.projectId(), member.user.id, updateData)),
        catchError(error => {
          const errorMessage = error?.error?.detail || 'Failed to update member';
          this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
          this.state.update(s => ({ ...s, updating: false }));
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        if (this.isCurrentUserAMember(member)) {
          this.refreshProjectDetails();
        }
        this.loadMembers();

        this.snackBar.open('Member updated successfully', 'Close', { duration: 3000 });
      });
  }

  protected onRemoveMember(member: ProjectMember): void {
    const dialogRef = this.dialog.open<ConfirmationDialogComponent, ConfirmDialogData, boolean>(
      ConfirmationDialogComponent,
      {
        width: '400px',
        data: {
          title: 'Remove Project Member',
          message: `Are you sure you want to remove ${member.user.firstName} ${member.user.lastName} from this project?`,
          confirmText: 'Remove',
          cancelText: 'Cancel'
        }
      }
    );

    dialogRef.afterClosed()
      .pipe(
        filter((confirmed): confirmed is true => !!confirmed),
        tap(() => this.state.update(s => ({ ...s, updating: true }))),
        switchMap(() => this.membersApi.remove(this.projectId(), member.user.id)),
        catchError(error => {
          this.state.update(s => ({ ...s, updating: false }));

          const errorMessage = error?.error?.detail || 'Failed to remove member';
          this.snackBar.open(errorMessage, 'Close', { duration: 5000 });

          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        if (this.isCurrentUserAMember(member)) {
          this.router.navigate([AppNavRoutes.projects.list]);
        } else {
          this.loadMembers();
        }

        this.snackBar.open('Member removed successfully', 'Close', { duration: 3000 });
      });
  }

  protected canRemoveMemberCheck(member: ProjectMember): boolean {
    return this.canRemoveMember() && !this.isLastOwner(member);
  }

  protected getEditTooltip(_member: ProjectMember): string {
    if (!this.canUpdateMemberRole()) {
      return 'You do not have permission. Ask project owner for help';
    }
    return '';
  }

  protected getRemoveTooltip(member: ProjectMember): string {
    if (!this.canRemoveMember()) {
      return 'You do not have permission. Ask project owner for help';
    }
    if (this.isLastOwner(member)) {
      return 'Cannot remove the only owner. Project must have at least one owner';
    }
    return '';
  }

  private loadMembers(): void {
    this.state.update(s => ({ ...s, loading: true, error: null }));

    this.membersApi.getList(this.projectId())
      .pipe(
        catchError(_error => {
          this.state.update(s => ({
            ...s,
            loading: false,
            error: 'Failed to load project members'
          }));
          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(result => {
        this.state.set({
          members: result.items,
          loading: false,
          updating: false,
          error: null
        });
      });
  }

  protected onBackToProject(): void {
    this.router.navigate([AppNavRoutes.projects.board(this.projectId())]);
  }

  private loadProjectDetails(): void {
    this.projectStateService.init(this.projectId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (err) => {
          this.router.navigate([AppNavRoutes.projects.list]);
          this.snackBar.open('Failed to load project details. Please try again', 'Close');
          console.error('Error loading project details:', err);
        }
      });
  }

  private refreshProjectDetails(): void {
    this.projectStateService.refresh()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (err) => {
          this.router.navigate([AppNavRoutes.projects.list]);
          this.snackBar.open('Failed to load project details. Please try again', 'Close');
          console.error('Error loading project details:', err);
        }
      });
  }

  private isCurrentUserAMember(member: ProjectMember): boolean {
    const currentUserId = this.userProfile()?.id;
    return currentUserId === member.user.id;
  }

  private isLastOwner(member: ProjectMember): boolean {
    return member.role === ProjectRole.Owner && this.ownerCount() <= 1;
  }
}
