import { IUserRepository } from '../../repositories/IUserRepository';
import { UserResponse } from '../../../domain/entities/UserEntity';

export class GetAllStudentsUseCase {
  constructor(private _userRepository: IUserRepository) {}

  async execute(params: { page: number; limit: number; search?: string; filter?: string }): Promise<{ data: UserResponse[]; total: number }> {
    const { page, limit, search } = params;
    const rawFilter = params.filter;

    // validate filter safely
    const allowedFilters = ['all', 'blocked', 'unblocked', 'verified', 'unverified'] as const;
    type AllowedFilter = typeof allowedFilters[number];

    let filter: AllowedFilter | undefined = 'all';
    if (rawFilter && (allowedFilters as readonly string[]).includes(rawFilter)) {
      filter = rawFilter as AllowedFilter;
    }

    const { data: users, total } = await this._userRepository.findAllByRoleWithPagination('student', {
      page,
      limit,
      search,
      filter, // ✅ now it's correctly typed
    });

    const userResponses: UserResponse[] = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email.value,
      phone: user.phone ? user.phone.value : null,
      isVerified: user.isVerified,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt,
    }));

    return { data: userResponses, total };
  }
}
