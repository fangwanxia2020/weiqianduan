import Vue from 'vue';
import store from '@/store/index';
// 获取当前用户的第一个部门信息
/**
 * @description 获取当前用户的第一个部门信息
 */
export const getDept = () => {
  const map = store.state.user.userInfo.deptMap;
  const deptList = Object.keys(map).map((deptId) => {
    return { deptId, deptName: map[deptId] };
  });
  return deptList[0] || {};
};

// 获取当前用户角色是否为承包商
export const isContractor = () => {
  return !!store.state.user.userInfo.contractorInfo.contractorId;
};

// 获取当前用户的承包商信息
export const getContractorInfo = () => {
  return store.state.user.userInfo.contractorInfo;
};

export const getUserInfo = () => {
  return store.state.user.userInfo;
};

export default {
  getDept,
  isContractor,
  getContractorInfo,
  getUserInfo,
};
