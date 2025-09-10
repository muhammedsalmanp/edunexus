import { AdminEntity, BaseUserEntity, StudentEntity, TeacherEntity } from '../../domain/entities/UserEntity';
import { UserRepository } from '../../app/repositories/UserRepository';
import { UserModel, UserDocument } from '../database/models/UserModel';
import { Email } from '../../domain/valueObjects/Email';
import { Password } from '../../domain/valueObjects/Password';
import { Phone } from '../../domain/valueObjects/Phone';
import * as bcrypt from 'bcrypt';
import { TeacherProfileDTO } from '../../domain/dtos/TeacherProfileDTO';
import { UpdateTeacherProfileDTO } from '../../domain/dtos/UpdateTeacherProfileDTO';
import { Model } from "mongoose";

export class userRepository implements UserRepository {

  async findByEmail(email: string): Promise<BaseUserEntity | null> {
    if (!email) {
      throw new Error('Email is required');
    }
    const userDoc: UserDocument | null = await UserModel.findOne({ email }).exec();
    if (!userDoc) return null;

    switch (userDoc.role) {
      case 'student':
        return new StudentEntity(
          userDoc.id,
          userDoc.name,
          Email.create(userDoc.email),
          Password.create(userDoc.password),
          Phone.create(userDoc.phone),
          userDoc.isVerified,
          userDoc.isBlocked,
          userDoc.approvedByAdmin,
          userDoc.hasApplied,
          userDoc.createdAt,
        );
      case 'teacher':
        return new TeacherEntity(
          userDoc.id,
          userDoc.name,
          Email.create(userDoc.email),
          Password.create(userDoc.password),
          Phone.create(userDoc.phone),
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
          userDoc.createdAt,
        );
      case 'admin':
        return new AdminEntity(
          userDoc.id,
          userDoc.name,
          Email.create(userDoc.email),
          Password.create(userDoc.password),
          Phone.create(userDoc.phone),
          userDoc.isVerified,
          userDoc.isBlocked,
          userDoc.approvedByAdmin,
          userDoc.hasApplied,
          userDoc.createdAt,
        );
    }
    return null;
  }

  async save<T extends BaseUserEntity>(user: T, role: 'student' | 'teacher' | 'admin'): Promise<T> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password.value, saltRounds);

    let userDoc;
    switch (role) {
      case 'student':
        userDoc = new UserModel({
          _id: user.id,
          name: user.name,
          email: user.email.value,
          password: hashedPassword,
          phone: user.phone.value,
          role: 'student',
          approvedByAdmin: "approved",
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
          phone: user.phone.value,
          role: 'teacher',
          approvedByAdmin: "pending",
          qualifications: user.qualifications,
          experience: user.experience,
          certificates: user.certificates,
          createdAt: user.createdAt,
        });
        break;
      case 'admin':
        userDoc = new UserModel({
          _id: user.id,
          name: user.name,
          email: user.email.value,
          password: hashedPassword,
          phone: user.phone.value,
          role: 'admin',
          approvedByAdmin: "approved",
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

    const isMatch = await bcrypt.compare(password, userDoc.password);
    if (!isMatch) return null;

    return this.findByEmail(email);
  }

  async findById(id: string): Promise<BaseUserEntity | null> {
    const user = await UserModel.findById(id).exec();
    if (!user) return null;

    const email = Email.create(user.email);
    const phone = Phone.create(user.phone);
    const password = Password.create(user.password);

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
          user.createdAt
        );
      case 'teacher':
        return new TeacherEntity(
          user._id,
          user.name,
          email,
          password,
          phone,
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
          user.createdAt
        );
      case 'admin':
        return new AdminEntity(
          user._id,
          user.name,
          email,
          password,
          phone,
          user.isVerified,
          user.isBlocked,
          user.approvedByAdmin,
          user.hasApplied,
          user.createdAt
        );
      default:
        throw new Error(`Unknown user role: ${user.role}`);
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
      switch (userDoc.role) {
        case 'student':
          return new StudentEntity(
            userDoc.id,
            userDoc.name,
            Email.create(userDoc.email),
            Password.create(userDoc.password),
            Phone.create(userDoc.phone),
            userDoc.isVerified,
            userDoc.isBlocked,
            userDoc.approvedByAdmin,
            userDoc.hasApplied,
            userDoc.createdAt,
          );
        case 'teacher':
          return new TeacherEntity(
            userDoc.id,
            userDoc.name,
            Email.create(userDoc.email),
            Password.create(userDoc.password),
            Phone.create(userDoc.phone),
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
            userDoc.createdAt,
          );
        case 'admin':
          return new AdminEntity(
            userDoc.id,
            userDoc.name,
            Email.create(userDoc.email),
            Password.create(userDoc.password),
            Phone.create(userDoc.phone),
            userDoc.isVerified,
            userDoc.isBlocked,
            userDoc.approvedByAdmin,
            userDoc.hasApplied,
            userDoc.createdAt,
          );
        default:
          throw new Error(`Invalid role: ${userDoc.role}`);
      }
    });
  }

  async getTeacherProfileById(id: string): Promise<TeacherProfileDTO | null> {
    const userDoc: UserDocument | null = await UserModel.findById({ _id: id, hasApplied: true }).exec();
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
      switch (role) {
        case 'teacher':
          return new TeacherEntity(
            userData._id,
            userData.name,
            Email.create(userData.email,),
            Password.create(userData.password,),
            Phone.create(userData.phone,),
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
            userData.createdAt
          );
        case 'student':
          return new StudentEntity(
            userData._id,
            userData.name,
            Email.create(userData.email,),
            Password.create(userData.password,),
            Phone.create(userData.phone,),
            userData.isVerified,
            userData.isBlocked,
            userData.approvedByAdmin,
            userData.hasApplied,
            userData.createdAt
          );
        case 'admin':
          return new AdminEntity(
            userData._id,
            userData.name,
            Email.create(userData.email,),
            Password.create(userData.password,),
            Phone.create(userData.phone,),
            userData.isVerified,
            userData.isBlocked,
            userData.approvedByAdmin,
            userData.hasApplied,
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
    action: "approved" | "rejected",
    rejectionMessage?: string // Add rejectionMessage parameter
  ): Promise<BaseUserEntity | null> {
    try {
      const updateData: any = {
        approvedByAdmin: action,
        updatedAt: new Date(),
      };

      // Only include rejectionMessage if action is "rejected"
      if (action === "rejected") {
        updateData.rejectionMessage = rejectionMessage;
      } else {
        updateData.rejectionMessage = null; // Clear rejectionMessage if approving
      }

      const updatedDoc = await UserModel.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      ).exec();

      if (!updatedDoc) return null;

      const { role, ...userData } = updatedDoc.toObject();

      switch (role) {
        case "teacher":
          return new TeacherEntity(
            userData._id,
            userData.name,
            Email.create(userData.email),
            Password.create(userData.password),
            Phone.create(userData.phone),
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
            userData.createdAt
          );
        case "student":
          return new StudentEntity(
            userData._id,
            userData.name,
            Email.create(userData.email),
            Password.create(userData.password),
            Phone.create(userData.phone),
            userData.isVerified,
            userData.isBlocked,
            userData.approvedByAdmin,
            userData.hasApplied,
            userData.createdAt
          );
        case "admin":
          return new AdminEntity(
            userData._id,
            userData.name,
            Email.create(userData.email),
            Password.create(userData.password),
            Phone.create(userData.phone),
            userData.isVerified,
            userData.isBlocked,
            userData.approvedByAdmin,
            userData.hasApplied,
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

  async apply(userId: string): Promise<void> {
    try {
      const user = await UserModel.findById(userId).exec();
      if (!user) {
        throw new Error('User not found');
      }
      if (user.role !== 'teacher') {
        throw new Error('Only teachers can apply');
      }

      await UserModel.updateOne(
        { _id: userId },
        { $set: { hasApplied: !user.hasApplied, updatedAt: new Date() } },
        { runValidators: true }
      ).exec();
      console.log(user);

    } catch (error) {
      console.error(`MongoUserRepository: Error toggling apply status for user ID ${userId}:`, error);
      throw error;
    }
  }

}