import { AdminEntity, BaseUserEntity, StudentEntity, TeacherEntity } from '../../domain/entities/UserEntity';
import { IUserRepository } from '../../app/repositories/IUserRepository';
import { UserModel, UserDocument } from '../database/models/UserModel';
import { Email } from '../../domain/valueObjects/Email';
import { Password } from '../../domain/valueObjects/Password';
import { Phone } from '../../domain/valueObjects/Phone';
import * as bcrypt from 'bcrypt';
import { TeacherProfileDTO } from '../../domain/dtos/TeacherProfileDTO';
import { UpdateTeacherProfileDTO } from '../../domain/dtos/UpdateTeacherProfileDTO';
import { Model } from "mongoose";

interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
   filter?: 'all' | 'blocked' | 'unblocked' | 'verified' | 'unverified' | 'pending' | 'approved' | 'rejected'
}


export class userRepository implements IUserRepository {

  async findByEmail(email: string): Promise<BaseUserEntity | null> {
    if (!email) {
      throw new Error("Email is required");
    }

    const userDoc: UserDocument | null = await UserModel.findOne({ email }).exec();
    if (!userDoc) return null;

    const password = userDoc.password ? Password.create(userDoc.password) : null;
    const phone = userDoc.phone ? Phone.create(userDoc.phone) : null;


    switch (userDoc.role) {
      case "student":
        return new StudentEntity(
          userDoc.id,
          userDoc.name,
          Email.create(userDoc.email),
          password,
          phone,
          userDoc.isVerified,
          userDoc.isBlocked,
          userDoc.approvedByAdmin,
          userDoc.hasApplied,
          userDoc.isActive,
          userDoc.googleId,
          userDoc.createdAt
        );

      case "teacher":
        return new TeacherEntity(
          userDoc.id,
          userDoc.name,
          Email.create(userDoc.email),
          password,
          phone,
          userDoc.qualifications || [],
          userDoc.experience || 0,
          userDoc.certificates || [],
          userDoc.bio,
          userDoc.profilePic,
          userDoc.educationHistory,
          userDoc.specializations,
          userDoc.awards,
          userDoc.rejectionMessage,
          userDoc.isVerified,
          userDoc.approvedByAdmin,
          userDoc.isBlocked,
          userDoc.hasApplied,
          userDoc.isActive,
          userDoc.googleId,
          userDoc.createdAt
        );

      case "admin":
        return new AdminEntity(
          userDoc.id,
          userDoc.name,
          Email.create(userDoc.email),
          password,
          phone,
          userDoc.isVerified,
          userDoc.isBlocked,
          userDoc.approvedByAdmin,
          userDoc.hasApplied,
          userDoc.isActive,
          userDoc.googleId,
          userDoc.createdAt
        );
    }

    return null;
  }


  async save<T extends BaseUserEntity>(user: T, role: 'student' | 'teacher' | 'admin'): Promise<T> {
    let hashedPassword: string | null = null;

    // Hash password only if it exists
    if (user.password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(user.password.value, saltRounds);
    }

    // Handle phone value safely
    const phoneValue = user.phone ? user.phone.value : null;

    let userDoc;

    switch (role) {
      case 'student':
        userDoc = new UserModel({
          _id: user.id,
          name: user.name,
          email: user.email.value,
          password: hashedPassword,
          phone: phoneValue,
          role: 'student',
          approvedByAdmin: 'approved',
          createdAt: user.createdAt,
        });
        break;

      case 'teacher':
        if (!(user instanceof TeacherEntity)) {
          throw new Error('Invalid user type for teacher role');
        }
        userDoc = new UserModel({
          _id: user.id,
          name: user.name,
          email: user.email.value,
          password: hashedPassword,
          phone: phoneValue,
          role: 'teacher',
          approvedByAdmin: 'pending',
          qualifications: user.qualifications,
          experience: user.experience,
          certificates: user.certificates,
          bio: user.bio,
          profilePic: user.profilePic,
          educationHistory: user.educationHistory,
          specializations: user.specializations,
          awards: user.awards,
          createdAt: user.createdAt,
        });
        break;

      case 'admin':
        userDoc = new UserModel({
          _id: user.id,
          name: user.name,
          email: user.email.value,
          password: hashedPassword,
          phone: phoneValue,
          role: 'admin',
          approvedByAdmin: 'approved',
          createdAt: user.createdAt,
        });
        break;
    }

    await userDoc.save();
    return user as T;
  }


  async findByCredentials(email: string, password: string): Promise<BaseUserEntity | null> {
    if (!email || !password) {
      throw new Error('Email and Password are required');
    }

    const userDoc: UserDocument | null = await UserModel.findOne({ email }).exec();
    if (!userDoc) return null;
    if (userDoc.password) {
      const isMatch = await bcrypt.compare(password, userDoc.password);
      if (!isMatch) return null;
    }



    return this.findByEmail(email);
  }

  async findById(id: string): Promise<BaseUserEntity | null> {
    const user = await UserModel.findById(id).exec();
    if (!user) return null;

    const email = Email.create(user.email);
    const phone = user.phone ? Phone.create(user.phone) : null;
    const password = user.password ? Password.create(user.password) : null;



    switch (user.role) {
      case 'student':
        return new StudentEntity(
          user._id,
          user.name,
          email,
          password,
          phone,
          user.isVerified,
          user.isBlocked,
          user.approvedByAdmin,
          user.hasApplied,
          user.isActive,
          user.googleId,
          user.createdAt,
        );

      case 'teacher':
        return new TeacherEntity(
          user._id,
          user.name,
          email,
          password, // can be null
          phone,    // can be null
          user.qualifications || [],
          user.experience || 0,
          user.certificates || [],
          user.bio,
          user.profilePic,
          user.educationHistory || [],
          user.specializations || [],
          user.awards || [],
          user.rejectionMessage,
          user.isVerified,
          user.approvedByAdmin,
          user.isBlocked,
          user.hasApplied,
          user.isActive,
          user.googleId,
          user.createdAt,
        );

      case 'admin':
        return new AdminEntity(
          user._id,
          user.name,
          email,
          password, // can be null
          phone,    // can be null
          user.isVerified,
          user.isBlocked,
          user.approvedByAdmin,
          user.hasApplied,
          user.isActive,
          user.googleId,
          user.createdAt,
        );

      default:
        throw new Error(`Unknown user role: ${user.role}`);
    }
  }
  async apply(userId: string): Promise<void> {
    try {
      await UserModel.findByIdAndUpdate(
        userId,
        {
          hasApplied: true,
          approvedByAdmin: 'pending', // Set to pending on apply
          rejectionMessage: null, // Clear rejection message
          updatedAt: new Date(),
        },
        { runValidators: true }
      ).exec();
    } catch (error) {
      console.error(`MongoUserRepository: Error applying for user ID ${userId}:`, error);
      throw new Error('Failed to apply teacher status');
    }
  }

  async updatePassword(email: string, hashedPassword: string): Promise<void> {
    await UserModel.updateOne({ email }, { password: hashedPassword }).exec();
  }

  async verifyUser(email: string): Promise<void> {
    await UserModel.updateOne({ email }, { $set: { isVerified: true } }).exec();
  }

  async findAllByRole(role: 'student' | 'teacher' | 'admin'): Promise<BaseUserEntity[]> {
    const users = await UserModel.find({ role }).exec();

    return users.map(userDoc => {
      const email = Email.create(userDoc.email);
      const password = userDoc.password ? Password.create(userDoc.password) : null;
      const phone = userDoc.phone ? Phone.create(userDoc.phone) : null;


      switch (userDoc.role) {
        case 'student':
          return new StudentEntity(
            userDoc._id,
            userDoc.name,
            email,
            password,
            phone,
            userDoc.isVerified,
            userDoc.isBlocked,
            userDoc.approvedByAdmin,
            userDoc.hasApplied,
            userDoc.isActive,
            userDoc.googleId,
            userDoc.createdAt
          );
        case 'teacher':
          return new TeacherEntity(
            userDoc._id,
            userDoc.name,
            email,
            password,
            phone,
            userDoc.qualifications || [],
            userDoc.experience || 0,
            userDoc.certificates || [],
            userDoc.bio,
            userDoc.profilePic,
            userDoc.educationHistory || [],
            userDoc.specializations || [],
            userDoc.awards || [],
            userDoc.rejectionMessage,
            userDoc.isVerified,
            userDoc.approvedByAdmin,
            userDoc.isBlocked,
            userDoc.hasApplied,
            userDoc.isActive,
            userDoc.googleId,
            userDoc.createdAt
          );
        case 'admin':
          return new AdminEntity(
            userDoc._id,
            userDoc.name,
            email,
            password,
            phone,
            userDoc.isVerified,
            userDoc.isBlocked,
            userDoc.approvedByAdmin,
            userDoc.hasApplied,
            userDoc.isActive,
            userDoc.googleId,
            userDoc.createdAt
          );
        default:
          throw new Error(`Invalid role: ${userDoc.role}`);
      }
    });
  }


async getTeacherProfileById(id: string): Promise<TeacherProfileDTO | null> {
  const userDoc: UserDocument | null = await UserModel.findById(id).exec();
  if (!userDoc || userDoc.role !== 'teacher') return null;

  return {
    _id: userDoc._id,
    name: userDoc.name,
    email: userDoc.email,
    phone: userDoc.phone,
    role: userDoc.role,
    qualifications: userDoc.qualifications,
    experience: userDoc.experience,
    certificates: userDoc.certificates,
    bio: userDoc.bio,
    profilePic: userDoc.profilePic,
    educationHistory: userDoc.educationHistory,
    specializations: userDoc.specializations,
    approvedByAdmin: userDoc.approvedByAdmin,
    rejectionMessage: userDoc.rejectionMessage,
    awards: userDoc.awards,
    isBlocked: userDoc.isBlocked,
    isVerified: userDoc.isVerified,
    hasApplied: userDoc.hasApplied,
    createdAt: userDoc.createdAt,
  };
}

  async updateTeacherProfile(id: string, updates: UpdateTeacherProfileDTO): Promise<TeacherProfileDTO | null> {
    const updateData: any = { ...updates };
    if (updateData.qualifications === undefined) updateData.qualifications = [];
    if (updateData.certificates === undefined) updateData.certificates = [];
    if (updateData.educationHistory === undefined) updateData.educationHistory = [];
    if (updateData.specializations === undefined) updateData.specializations = [];
    if (updateData.awards === undefined) updateData.awards = [];

    const userDoc: UserDocument | null = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: updateData
      }, {
      new: true,
      runValidators: true,
    }
    ).exec();

    if (!userDoc || userDoc.role !== 'teacher') return null;

    return {
      name: userDoc.name,
      email: userDoc.email,
      phone: userDoc.phone,
      qualifications: userDoc.qualifications,
      experience: userDoc.experience,
      certificates: userDoc.certificates,
      bio: userDoc.bio,
      profilePic: userDoc.profilePic,
      educationHistory: userDoc.educationHistory,
      specializations: userDoc.specializations,
      approvedByAdmin: userDoc.approvedByAdmin,
      awards: userDoc.awards,
      isBlocked: userDoc.isBlocked,
      isVerified: userDoc.isVerified,
      createdAt: userDoc.createdAt,
    }
  }

  async updateUserBlockStatus(userId: string, isBlocked: boolean): Promise<BaseUserEntity | null> {
    try {
      const updatedDoc = await UserModel.findByIdAndUpdate(
        userId,
        { isBlocked, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).exec();

      if (!updatedDoc) return null;

      const { role, ...userData } = updatedDoc.toObject();
      const password = userData.password ? Password.create(userData.password) : null;
      const phone = userData.phone ? Phone.create(userData.phone) : Phone.create('');
      switch (role) {
        case 'teacher':
          return new TeacherEntity(
            userData._id,
            userData.name,
            Email.create(userData.email,),
            password,
            phone,
            userData.qualifications,
            userData.experience,
            userData.certificates,
            userData.bio,
            userData.profilePic,
            userData.educationHistory,
            userData.specializations,
            userData.awards,
            userData.rejectionMessage,
            userData.isVerified,
            userData.approvedByAdmin,
            userData.isBlocked,
            userData.hasApplied,
            userData.isActive,
            userData.googleId,
            userData.createdAt
          );
        case 'student':
          return new StudentEntity(
            userData._id,
            userData.name,
            Email.create(userData.email,),
            password,
            phone,
            userData.isVerified,
            userData.isBlocked,
            userData.approvedByAdmin,
            userData.hasApplied,
            userData.isActive,
            userData.googleId,
            userData.createdAt
          );
        case 'admin':
          return new AdminEntity(
            userData._id,
            userData.name,
            Email.create(userData.email,),
            password,
            phone,
            userData.isVerified,
            userData.isBlocked,
            userData.approvedByAdmin,
            userData.hasApplied,
            userData.isActive,
            userData.googleId,
            userData.createdAt
          );
        default:
          return null;
      }
    } catch (error) {
      console.error(`MongoUserRepository: Error updating block status for user ID ${userId}:`, error);
      throw error;
    }
  }

  async updateUserApprovalStatus(
    userId: string,
    action: 'approved' | 'rejected',
    rejectionMessage?: string
  ): Promise<BaseUserEntity | null> {
    try {
      const updateData: any = {
        approvedByAdmin: action,
        hasApplied: false,
        updatedAt: new Date(),
      };

      if (action === 'rejected') {
        updateData.rejectionMessage = rejectionMessage;
      } else {
        updateData.rejectionMessage = null;
      }

      const updatedDoc = await UserModel.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      ).exec();

      if (!updatedDoc) return null;
      const password = updatedDoc.password ? Password.create(updatedDoc.password) : null;
      const phone = updatedDoc.phone ? Phone.create(updatedDoc.phone) : Phone.create('');
      const { role, ...userData } = updatedDoc.toObject();

      switch (role) {
        case 'teacher':
          return new TeacherEntity(
            userData._id,
            userData.name,
            Email.create(userData.email),
            password,
            phone,
            userData.qualifications,
            userData.experience,
            userData.certificates,
            userData.bio,
            userData.profilePic,
            userData.educationHistory,
            userData.specializations,
            userData.awards,
            userData.rejectionMessage,
            userData.isVerified,
            userData.approvedByAdmin,
            userData.isBlocked,
            userData.hasApplied,
            userData.isActive,
            userData.googleId,
            userData.createdAt
          );
        case 'student':
          return new StudentEntity(
            userData._id,
            userData.name,
            Email.create(userData.email),
            password,
            phone,
            userData.isVerified,
            userData.isBlocked,
            userData.approvedByAdmin,
            userData.hasApplied,
            userData.isActive,
            userData.googleId,
            userData.createdAt
          );
        case 'admin':
          return new AdminEntity(
            userData._id,
            userData.name,
            Email.create(userData.email),
            password,
            phone,
            userData.isVerified,
            userData.isBlocked,
            userData.approvedByAdmin,
            userData.hasApplied,
            userData.isActive,
            userData.googleId,
            userData.createdAt
          );
        default:
          return null;
      }
    } catch (error) {
      console.error(`MongoUserRepository: Error updating approval status for user ID ${userId}:`, error);
      throw error;
    }
  }

  async findByGoogleId(googleId: string): Promise<BaseUserEntity | null> {
    if (!googleId) throw new Error('googleId required');
    const userDoc = await UserModel.findOne({ googleId }).exec();
    if (!userDoc) return null;

    const emailVO = Email.create(userDoc.email);
    const passwordVO = userDoc.password ? Password.create(userDoc.password) : null;
    const phoneVO = userDoc.phone ? Phone.create(userDoc.phone) : null;
    const createdAt = userDoc.createdAt ? new Date(userDoc.createdAt) : new Date();

    switch (userDoc.role) {
      case 'student':
        return new StudentEntity(
          userDoc._id,
          userDoc.name,
          emailVO,
          passwordVO,
          phoneVO,
          userDoc.isVerified,
          userDoc.isBlocked,
          userDoc.approvedByAdmin,
          userDoc.hasApplied,
          userDoc.isActive,
          userDoc.googleId,
          createdAt
        );
      case 'teacher':
        return new TeacherEntity(
          userDoc._id,
          userDoc.name,
          emailVO,
          passwordVO,
          phoneVO,
          userDoc.qualifications || [],
          userDoc.experience || 0,
          userDoc.certificates || [],
          userDoc.bio,
          userDoc.profilePic,
          userDoc.educationHistory || [],
          userDoc.specializations || [],
          userDoc.awards || [],
          userDoc.rejectionMessage,
          userDoc.isVerified,
          userDoc.approvedByAdmin,
          userDoc.isBlocked,
          userDoc.hasApplied,
          userDoc.isActive,
          userDoc.googleId,
          createdAt
        );
      case 'admin':
        return new AdminEntity(
          userDoc._id,
          userDoc.name,
          emailVO,
          passwordVO,
          phoneVO,
          userDoc.isVerified,
          userDoc.isBlocked,
          userDoc.approvedByAdmin,
          userDoc.hasApplied,
          userDoc.isActive,
          userDoc.googleId,
          createdAt
        );
      default:
        return null;
    }
  }

  async createFromGoogle(profile: {
    id: string;  // Google sub
    googleId: string;
    email: string;
    name: string;
    picture?: string;
    phone?: string | null;
    role?: 'student' | 'teacher' | 'admin';
  }): Promise<BaseUserEntity> {


    const newDoc = new UserModel({
      _id: profile.id,           // 👈 same logic as normal registration
      googleId: profile.googleId,      // 👈 store Google’s sub here
      name: profile.name,
      email: profile.email,
      profilePic: profile.picture || undefined,
      phone: profile.phone || null,
      role: profile.role || 'student',
      isVerified: true,
      isActive: true,
      approvedByAdmin: profile.role === 'teacher' ? 'pending' : 'approved',
      createdAt: new Date(),
    });

    await newDoc.save();

    const createdEntity = await this.findByGoogleId(profile.googleId);
    if (!createdEntity) throw new Error('Failed to create Google user');

    return createdEntity;
  }


 async findAllByRoleWithPagination(
    role: 'student' | 'teacher' | 'admin',
    params: PaginationParams
  ): Promise<{ data: BaseUserEntity[]; total: number }> {
    const { page, limit, search, filter } = params;
    const query: any = { role };

    // Only add search if provided
    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Only apply filter if not 'all'
    if (filter && filter !== 'all') {
      switch (filter) {
        case 'blocked':
          query.isBlocked = true;
          break;
        case 'unblocked':
          query.isBlocked = false;
          break;
        case 'verified':
          query.isVerified = true;
          break;
        case 'unverified':
          query.isVerified = false;
          break;
        case 'pending':
          query.approvedByAdmin = 'pending';
          break;
        case 'approved':
          query.approvedByAdmin = 'approved';
          break;
        case 'rejected':
          query.approvedByAdmin = 'rejected';
          break;
      }
    }

    const skip = (page - 1) * limit;

    const [userDocs, total] = await Promise.all([
      UserModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      UserModel.countDocuments(query).exec()
    ]);

    const users: BaseUserEntity[] = userDocs.map(userDoc => {
      const email = Email.create(userDoc.email);
      const phone = userDoc.phone ? Phone.create(userDoc.phone) : null;
      const password = userDoc.password ? Password.create(userDoc.password) : null;

      switch (userDoc.role) {
        case 'student':
          return new StudentEntity(
            userDoc._id, userDoc.name, email, password, phone,
            userDoc.isVerified, userDoc.isBlocked,
            userDoc.approvedByAdmin, userDoc.hasApplied,
            userDoc.isActive, userDoc.googleId, userDoc.createdAt
          );
        case 'teacher':
          return new TeacherEntity(
            userDoc._id, userDoc.name, email, password, phone,
            userDoc.qualifications || [], userDoc.experience || 0,
            userDoc.certificates || [], userDoc.bio,
            userDoc.profilePic, userDoc.educationHistory || [],
            userDoc.specializations || [], userDoc.awards || [],
            userDoc.rejectionMessage, userDoc.isVerified,
            userDoc.approvedByAdmin, userDoc.isBlocked,
            userDoc.hasApplied, userDoc.isActive,
            userDoc.googleId, userDoc.createdAt
          );
        case 'admin':
          return new AdminEntity(
            userDoc._id, userDoc.name, email, password, phone,
            userDoc.isVerified, userDoc.isBlocked,
            userDoc.approvedByAdmin, userDoc.hasApplied,
            userDoc.isActive, userDoc.googleId, userDoc.createdAt
          );
      }
    }).filter(Boolean) as BaseUserEntity[];

    return { data: users, total };
  }

  async countByRoleWithFilter(
    role: 'student' | 'teacher' | 'admin',
    filter?: 'all' | 'blocked' | 'unblocked' | 'verified' | 'unverified' | 'pending' | 'approved' | 'rejected',
    search?: string
  ): Promise<number> {
    const query: any = { role };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (filter && filter !== 'all') {
      switch (filter) {
        case 'blocked':
          query.isBlocked = true;
          break;
        case 'unblocked':
          query.isBlocked = false;
          break;
        case 'verified':
          query.isVerified = true;
          break;
        case 'unverified':
          query.isVerified = false;
          break;
        case 'pending':
          query.approvedByAdmin = null;
          query.hasApplied = true;
          break;
        case 'approved':
          query.approvedByAdmin = true;
          break;
        case 'rejected':
          query.approvedByAdmin = false;
          break;
      }
    }

    return await UserModel.countDocuments(query).exec();
  }

}

