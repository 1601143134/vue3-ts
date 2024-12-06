interface 和 type
type不仅可以定义对象类型，还可以定义更小单位的类型,如基础类型：
  type name = 'string' | 'number'

interface更多定义面向对象和类:
  interface IUser {
    name: string,
    age: number
  }

export const getUserList = (params: User.ReqUserParams) => {
  return http.post<ResPage<User.ResUserList>>(PORT1 + `/user/list`, params);
};

interface ResPage<T> {
  total: number;
  list: T[];
}

namespace User {
  export interface ResUserList {
    id: number;
    name: string;
    email: string;
  }
}