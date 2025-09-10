import { Response } from 'express';

export class HttpResponse {
  static created(res: Response, data: any): Response {
    return res.status(201).json({
      success: true,
      data,
    });
  }

  static ok(res: Response, data: any): Response {
    return res.status(200).json({
      success: true,
      data,
    });
  }

  static badRequest(res: Response, message: string): Response {
    return res.status(400).json({
      success: false,
      message,
    });
  }

  static unauthorized(res: Response, message: string): Response {
    return res.status(401).json({
      success: false,
      message,
    });
  }

  static forbidden(res: Response, message: string): Response {
    return res.status(403).json({
      success: false,
      message,
    });
  }

  static notFound(res: Response, message: string): Response {
    return res.status(404).json({
      success: false,
      message,
    });
  }

  static serverError(res: Response, error: any): Response {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
}