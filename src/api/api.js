import axios from 'axios';

import { ORDER_OPTIONS } from '../constants/orderOptions';

const TEAM_ID = '16-5';

const instance = axios.create({
  baseURL: `https://linkshop-api.vercel.app/${TEAM_ID}`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * LinkshopList를 가져오는 함수
 *
 * @param {string} [keyword = ''] 키워드 기반 검색
 * @param {string} [orderBy = 'recent'] 리스트 정렬 기준 (Available values : recent || likes || productsCount)
 * @param {number} [cursor = 0] 페이징을 위한 커서
 * @returns { list: Array<Linkshop>, nextCursor: number }
 */
export const getLinkshops = async ({
  keyword = '',
  orderBy = 'recent',
  cursor = 0,
}) => {
  if (cursor < 0) {
    throw new Error('cursor의 값이 잘못 입력되었습니다.(cursor >= 0)');
  }

  if (!Object.keys(ORDER_OPTIONS).find(e => e === orderBy)) {
    throw new Error(
      `orderBy의 값이 잘못 입력되었습니다.(입력된 값: ${orderBy})`,
    );
  }

  try {
    const res = await instance.get('/linkshops', {
      params: {
        keyword: keyword,
        orderBy: orderBy,
        cursor: cursor,
      },
    });
    return res.data;
  } catch (error) {
    console.log('링크샵 조회 중 오류 발생: ', error.message);
    throw error;
  }
};

/**
 * 좋아요를 생성하는 함수
 *
 * @param {number} linkShopId 대상 링크샵 ID
 * @returns { message: string } 처리 결과 메세지
 */
export const createLike = async linkShopId => {
  try {
    const res = await instance.post(`/linkshops/${linkShopId}/like`, {});
    return res.data;
  } catch (error) {
    console.log('좋아요 생성 중 오류 발생: ', error.message);
    throw error;
  }
};

/**
 * 좋아요를 삭제(취소)하는 함수
 *
 * @param {number} linkShopId 대상 링크샵 ID
 * @returns { message: string } 처리 결과 메세지
 */
export const deleteLike = async linkShopId => {
  try {
    const res = await instance.delete(`/linkshops/${linkShopId}/like`, {});
    return res.data;
  } catch (error) {
    console.log('좋아요 삭제 중 오류 발생: ', error.message);
    throw error;
  }
};

/**
 * 링크샵 상세 정보를 가져오는 함수
 * @param {number} linkshopId - 조회할 링크샵 ID
 * @returns {object} 링크샵 상세 데이터
 */
export const getLinkshopDetail = async linkshopId => {
  try {
    const res = await instance.get(`/linkshops/${linkshopId}`);
    return res.data;
  } catch (error) {
    console.error('상세 조회 실패', error);
    throw error;
  }
};

/**
 * 링크샵을 수정하는 함수
 * @param {number} linkshopId - 수정할 링크샵 ID
 * @param {FormData} formData - 수정할 데이터
 * @returns {object} 수정 후 링크샵 목록
 */
export const updateLinkshop = async (linkshopId, formData) => {
  try {
    const res = await instance.put(`/linkshops/${linkshopId}`, formData, {
      headers: {},
    });
    return res.data;
  } catch (error) {
    console.error('링크샵 수정 실패', error);
    throw error;
  }
};

const IMAGE_UPLOAD_FULL_URL = 'https://linkshop-api.vercel.app/images/upload';

const imageUploadInstance = axios.create({
  baseURL: 'https://linkshop-api.vercel.app',
  timeout: 15000,
});

/**
 * 이미지를 업로드하는 함수
 * @param {File} file
 * @returns {string} 업로드된 이미지의 URL
 */
export const uploadImage = async file => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await imageUploadInstance.post('/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.url;
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    throw error.response?.data?.message || '이미지 업로드에 실패했습니다.';
  }
};
