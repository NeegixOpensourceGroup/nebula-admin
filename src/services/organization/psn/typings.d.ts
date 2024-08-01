/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！

declare namespace API {
  interface PageInfo {
    /** 
1 */
    current?: number;
    pageSize?: number;
    total?: number;
    list?: Array<Record<string, any>>;
  }

  interface PageInfo_UserInfo_ {
    /** 
1 */
    current?: number;
    pageSize?: number;
    total?: number;
    list?: Array<PsnInfo>;
  }

  interface Result {
    success?: boolean;
    errorMessage?: string;
    data?: Record<string, any>;
  }

  interface Result_PageInfo_UserInfo__ {
    success?: boolean;
    errorMessage?: string;
    data?: PageInfo_UserInfo_;
  }

  interface Result_UserInfo_ {
    code?: number;
    message?: string;
    data?: PsnInfo;
  }

  interface Result_string_ {
    success?: boolean;
    errorMessage?: string;
    data?: string;
  }

  interface PsnInfo {
    id?: string|number;
    name?: string;
    /** nick */
    nickname?: string;
    /** email */
    email?: string;
    gender?: number;
    birthday?: string;
    cardKind?: string;
    card?: string;
    workDate?: string;
    homeAddress?: string;
    homeTel?: string;
    workTel?: string;
    phone?: string;
    status?: number;
    bizUnitPk?: number;
  }

  interface PsnInfoVO {
    id?: string;
    name?: string;
    /** nick */
    nickname?: string;
    /** email */
    email?: string;
    gender?: number;
    birthday?: string;
    cardKind?: string;
    card?: string;
    workDate?: string;
    homeAddress?: string;
    homeTel?: string;
    workTel?: string;
    phone?: string;
    status?: number;
    bizUnitPk?: number;
    dataSource?: Array<any>;
  }

  type definitions_0 = null;
}
