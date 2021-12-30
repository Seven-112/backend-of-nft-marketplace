import { BaseModel } from "../../common/model";

export class Todo extends BaseModel {
  name: string;
  isDone: boolean;
}
