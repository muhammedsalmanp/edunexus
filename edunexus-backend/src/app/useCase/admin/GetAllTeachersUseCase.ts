import { IUserRepository } from '../../repositories/IUserRepository';
import { UserResponse } from '../../../domain/entities/UserEntity';

export class GetAllTeachersUseCase {
  constructor(private _userRepository: IUserRepository) {}

  async execute(params: { page: number; limit: number; search?: string; filter?: string }): Promise<{ data: UserResponse[]; total: number }> {
    const { page, limit, search } = params;
    const rawFilter = params.filter;


    
const allowedFilters = ['all', 'blocked', 'unblocked', 'pending', 'approved', 'rejected'] as const;
    type AllowedFilter = typeof allowedFilters[number];

    let filter: AllowedFilter | undefined = 'all';
    if (rawFilter && (allowedFilters as readonly string[]).includes(rawFilter)) {
      filter = rawFilter as AllowedFilter;
    }
    const { data: users, total } = await this._userRepository.findAllByRoleWithPagination('teacher', {
      page,
      limit,
      search,
      filter,
    });

    const userResponses: UserResponse[] = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email.value,
      phone: user.phone ? user.phone.value : null,
      isVerified: user.isVerified,
      isBlocked: user.isBlocked,
      approvedByAdmin: user.approvedByAdmin,
      createdAt: user.createdAt,
    }));

    return { data: userResponses, total };
  }
}