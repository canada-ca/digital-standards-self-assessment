import { connectDB } from '../db/db.connection';
import TeamModel, { Team, TeamDocument } from '../models/team.model';
import { MongoServerError } from 'mongodb';

class TeamService {
  constructor() {
    console.log('Construct TeamService');
  }

  async create(team: Team): Promise<TeamDocument> {
    const teamModel = new TeamModel(team);
    try {
      await connectDB();
      return await teamModel.save();
    } catch (err: any) {
      if (err instanceof MongoServerError) {
        throw { ...err, message: err.message };
      } else {
        throw err;
      }
    }
  }

  async update(teamId: string, team: Partial<Team>): Promise<TeamDocument> {
    if (teamId) {
      try {
        await connectDB();
        return await TeamModel.findByIdAndUpdate(teamId, team, { useFindAndModify: false });
      } catch (err: any) {
        if (err instanceof MongoServerError) {
          throw { ...err, message: err.message };
        } else {
          throw err;
        }
      }
    }
  }

  async delete(teamId: string): Promise<TeamDocument> {
    try {
      await connectDB();
      return await TeamModel.findByIdAndDelete(teamId, { useFindAndModify: false }).exec();
    } catch (err: any) {
      if (err instanceof MongoServerError) {
        throw { ...err, message: err.message };
      } else {
        throw err;
      }
    }
  }

  async deleteAll(): Promise<number> {
    try {
      await connectDB();
      const result = await TeamModel.deleteMany({});
      return result.deletedCount;
    } catch (err: any) {
      if (err instanceof MongoServerError) {
        throw { ...err, message: err.message };
      } else {
        throw err;
      }
    }
  }

  async findById(teamId: string): Promise<TeamDocument> {
    try {
      await connectDB();
      return await TeamModel.findById(teamId).exec();
    } catch (err: any) {
      if (err instanceof MongoServerError) {
        throw { ...err, message: err.message };
      } else {
        throw err;
      }
    }
  }

  async findAll(): Promise<TeamDocument[]> {
    try {
      await connectDB();
      return await TeamModel.find({}).exec();
    } catch (err) {
      if (err instanceof MongoServerError) {
        throw { ...err, message: err.message };
      } else {
        throw err;
      }
    }
  }
}

export default new TeamService();
