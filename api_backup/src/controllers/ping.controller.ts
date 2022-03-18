import { Request, Response } from 'express';

class PingController {
  ping(req: Request, resp: Response) {
    resp.status(200).json({
      message: 'pong',
    });
  }
}

export = new PingController();
