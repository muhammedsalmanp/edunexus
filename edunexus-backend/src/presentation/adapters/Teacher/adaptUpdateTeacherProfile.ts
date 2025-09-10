import { Request, Response, NextFunction } from 'express';
import { UpdateTeacherProfileUseCase } from '../../../app/useCase/teacher/UpdateTeacherProfileUseCse';
import { UpdateTeacherProfileDTO } from '../../../domain/dtos/UpdateTeacherProfileDTO';
import { uploadTeacherFiles } from '../../../infrastructure/middleware/uploadMiddleware'; 

export const adaptUpdateTeacherProfile = (useCase: UpdateTeacherProfileUseCase) => {
  return [
    ...uploadTeacherFiles,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = req.user?.id;
        if (!id) {
          console.error('Adapter: User not authenticated');
          return res.status(401).json({ error: 'User not authenticated' });
        }

        console.log('Request Body:', req.body);
        console.log('Profile Pic:', req.file);
        console.log('Certificates:', req.files);

        const updates: UpdateTeacherProfileDTO = {
          name: req.body.name,
          phone: req.body.phone,
          bio: req.body.bio,
          qualifications: req.body.qualifications ? JSON.parse(req.body.qualifications) : undefined,
          specializations: req.body.specializations ? JSON.parse(req.body.specializations) : undefined,
          educationHistory: req.body.educationHistory ? JSON.parse(req.body.educationHistory) : undefined,
          awards: req.body.awards ? JSON.parse(req.body.awards) : undefined,
          experience: req.body.experience ? parseInt(req.body.experience) : undefined,
        };

        const profilePicUrl = req.file?.signedUrl;
        const certificateUrls = req.files
          ? (req.files as { key: string; signedUrl: string }[]).map((file, index) => ({
              name: req.body.certificateMeta?.[index]?.name || `Certificate_${index + 1}`,
              year: req.body.certificateMeta?.[index]?.year
                ? parseInt(req.body.certificateMeta[index].year)
                : undefined,
              image: file.signedUrl,
            }))
          : req.body.certificateMeta
            ? Object.keys(req.body.certificateMeta).map((index) => ({
                name: req.body.certificateMeta[index].name || `Certificate_${parseInt(index) + 1}`,
                year: req.body.certificateMeta[index].year
                  ? parseInt(req.body.certificateMeta[index].year)
                  : undefined,
                image: '',
              }))
            : undefined;

        const updatedProfile = await useCase.execute(id, updates, profilePicUrl, certificateUrls);
        if (!updatedProfile) {
          return res.status(404).json({ error: 'Teacher profile not found' });
        }

        res.json(updatedProfile);
        console.log(updatedProfile);
      } catch (error) {
        console.error('Adapter Error updating profile:', error);
        next(error); 
      }
    },
  ];
};