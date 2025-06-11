import { createContext, useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { createLinkshop, uploadImage } from '../api/api';
import ConfirmCreateModal from '../components/ConfirmCreateModal';
import CreateProducts from '../components/CreateProducts';
import CreateShop from '../components/CreateShop';
import ErrorModal from '../components/ImageFormatErrorModal';
import BaseButton from '../components/PrimaryButton';
import { useAsync } from '../hooks/useAsync';
import theme from '../styles/theme';
import { ColorTypes } from '../styles/theme';
import deepIsEmpty from '../utils/deepIsEmpty';

const PageContainer = styled.div`
  min-width: 375px;
  margin: 0 auto;
  width: 100%;
  padding: 0 16px;
  @media (min-width: 768px) {
    width: 744px;
    padding: 0 24px;
  }
`;

const CreateButton = styled(BaseButton)`
  width: 344px;
  height: 50px;
  margin: 0 auto 124px;
  display: block;
  background-color: ${({ disabled }) =>
    disabled === true
      ? theme.colors[ColorTypes.SECONDARY_GRAY_200]
      : theme.colors[ColorTypes.PRIMARY]};

  @media (min-width: 768px) {
    width: 696px;
  }
`;

const INITIAL_DATA = {
  shop: { imageUrl: null, urlName: null, shopUrl: null },
  products: [],
  password: null,
  userId: null,
  name: null,
};

export const CreatePageContext = createContext();

function CreateShopPage({ onSuccess }) {
  const [completeData, setCompleteData] = useState(INITIAL_DATA);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isInvalidDetected, setIsInvalidDetected] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  //isInvalidDetected => ui에 영향을 주지 않고 필드의 데이터값이 유효한지 확인하여 create 요청 여부 결정
  //disabled => 실제 버튼이 활성화ui에 영향을 주는 상태
  const isMount = useRef(true);
  const { execute: asyncUploadImage, error: imageError } = useAsync(
    uploadImage,
    { delayLoadingTransition: true },
  );
  const {
    execute: asyncCreateLinkshop,
    isLoading: createLoading,
    error: createError,
  } = useAsync(createLinkshop, { delayLoadingTransition: true });
  const navigate = useNavigate();

  const handleConfirm = () => {
    setIsConfirmModalOpen(false);
    onSuccess?.();
    navigate('/list');
  };

  const handleCloseModal = () => {
    setIsErrorModalOpen(false);
  };

  const onSuccsessCreate = res => {
    if (res) {
      setIsConfirmModalOpen(true);
    }
  };

  const onFailCreate = () => {
    setIsErrorModalOpen(true);
    setIsLoading(prev => false);
    if (createError?.request?.response.includes('아이디입니다')) {
      setDisabled(prev => true);
    }
  };

  const handleValidation = () => {
    setIsInvalidDetected(prev => false);
    setIsValidating(prev => true);
  };

  const handleCreate = async () => {
    if (isInvalidDetected) {
      setDisabled(prev => true);
      return;
    }
    setIsLoading(prev => true);
    // 이미지 업로드 -> 데이터 전송 두 종류 api 순차 실행
    const copiedList = completeData.products.map(product => {
      return { ...product };
    });
    for (const product of copiedList) {
      product.imageUrl = await asyncUploadImage(product.imageUrl);
      delete product.id;
    }

    const copiedShop = { ...completeData.shop };
    copiedShop.imageUrl = await asyncUploadImage(copiedShop.imageUrl);

    const dataForSubmit = {
      ...completeData,
      products: [...copiedList],
      shop: { ...copiedShop },
    };

    const res = await asyncCreateLinkshop(dataForSubmit);

    onSuccsessCreate(res);
  };

  useEffect(() => {
    if (isMount.current) {
      isMount.current = false;
      return;
    }
    if (isValidating) {
      return;
    }
    handleCreate();
  }, [isValidating]);

  useEffect(() => {
    if (deepIsEmpty(completeData)) {
      setDisabled(prev => true);
    } else {
      setDisabled(prev => false);
    }
  }, [completeData]);

  useEffect(() => {
    const current = createLoading;
    setIsLoading(prev => (prev !== current ? createLoading : prev));
  }, [createLoading]);

  useEffect(() => {
    if (imageError || createError) {
      onFailCreate();
    }
  }, [imageError, createError]);

  return (
    <CreatePageContext.Provider
      value={{
        isValidating,
        setIsValidating,
        isInvalidDetected,
        setIsInvalidDetected,
      }}
    >
      <PageContainer>
        <CreateProducts onSaveCompleteData={setCompleteData} />
        <CreateShop onSaveCompleteData={setCompleteData} />
        <CreateButton
          type='button'
          onClick={handleValidation}
          disabled={disabled || isLoading}
        >
          {isLoading ? '생성중입니다..' : '생성하기'}
        </CreateButton>
        <ConfirmCreateModal
          onConfirm={handleConfirm}
          isOpen={isConfirmModalOpen}
          message='등록이 완료되었습니다.'
        />
        <ErrorModal
          onConfirm={handleCloseModal}
          isOpen={isErrorModalOpen}
          message={
            createError?.request?.response?.includes('아이디입니다')
              ? `이미 존재하는 아이디입니다.\n다른 아이디를 입력해 주세요.`
              : `요청을 보내는중 문제가 발생했습니다.\n다시 시도해 주세요.`
          }
        />
      </PageContainer>
    </CreatePageContext.Provider>
  );
}

export default CreateShopPage;
