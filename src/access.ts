export default (initialState: any) => {
  // 在这里按照初始化数据定义项目中的权限，统一管理
  // 参考文档 https://umijs.org/docs/max/access
  // const canSeeAdmin = !!(
  //   initialState && initialState.name !== 'dontHaveAccess'
  // );
  const access = initialState?.access.reduce((acc: any, permission: any) => {
    acc[permission] = true; // 默认值为 true
    return acc;
  }, {} as Record<string, boolean>);
  return access || {};
};
