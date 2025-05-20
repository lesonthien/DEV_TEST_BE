export interface RequestWithUser extends Request {
  user: {
    factNo: string;
    branchNo: string;
    deptNo: string;
    username: string;
    id: string;
  };
}
