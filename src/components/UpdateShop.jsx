import { useState, useEffect } from 'react';

import styled from 'styled-components';

import Field, { ErrorMessage } from './Field';
import FileField from './FileField';
import DeleteImg from '../assets/icon/btn_close.png';
import closeEyeIcon from '../assets/icon/btn_visibility_off.svg';
import openEyeIcon from '../assets/icon/btn_visibility_on.svg';
import { applyFontStyles } from '../styles/mixins';
import theme, { FontTypes, ColorTypes } from '../styles/theme';

const DEFAULT_EYE_SIZE = '20px';

const ShopSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 696px;
  margin: 75px auto;

  @media (min-width: 768px) {
    gap: 16px;
  }
`;

const ShopTitle = styled.h2`
  ${applyFontStyles(FontTypes.SEMIBOLD16, ColorTypes.SECONDARY_BLACK)};
  display: none;
  text-align: left;

  @media (min-width: 768px) {
    display: block;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors[ColorTypes.SECONDARY_WHITE_100]};
  border-radius: 16px;
  padding: 28px;
  gap: 30px;
  width: 100%;

  border: 1px solid
    ${({ hasError }) =>
      hasError ? theme.colors[ColorTypes.ERROR] : 'transparent'};
`;

export const TextGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ShopImg = styled.div`
  ${applyFontStyles(FontTypes.SEMIBOLD14, ColorTypes.SECONDARY_BLACK)}
`;

export const Description = styled.div`
  ${applyFontStyles(FontTypes.REGULAR17, ColorTypes.SECONDARY_GRAY_300)}
`;

export const PreviewGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-grow: 1;
`;

export const ImgGroup = styled.div`
  position: relative;
  width: 95px;
  height: 95px;
  border-radius: 15px;
  overflow: hidden;
`;

export const PreviewImg = styled.img`
  width: 100%;
  aspect-ratio: 1/1;
  object-fit: cover;
  border-radius: 15px;
`;

export const DeleteBtn = styled.button`
  position: absolute;
  top: 6px;
  right: 7px;
  width: 16px;
  height: 16px;
  border-radius: 9999px;
  background-color: ${theme.colors.secGray300};
  border: none;
  padding: 0;
  cursor: pointer;
  z-index: 1;
`;

export const ButtonX = styled.img`
  position: absolute;
  top: 3px;
  right: 3px;
  width: 10px;
  filter: invert(99%) sepia(0%) saturate(0%) hue-rotate(262deg) brightness(110%)
    contrast(101%);
  z-index: 2;
`;

const CloseEyeIcon = styled.img`
  aspect-ratio: 1/1;
  cursor: pointer;
`;

const UpdateShop = ({
  formData,
  onChange,
  formErrors,
  onBlur,
  shopImageUrl,
  onShopImageChange,
  onRemoveShopImage,
}) => {
  // 비밀번호 가시성 상태 관리
  const [openPassword, setOpenPassword] = useState(false);
  const [localShopImageUrl, setLocalShopImageUrl] = useState(null);
  const [displayImageUrl, setDisplayImageUrl] = useState(shopImageUrl);

  // shopImageUrl이 변경될 때 (예: API에서 이미지 로딩 완료 또는 삭제 시) displayImageUrl 업데이트
  useEffect(() => {
    setDisplayImageUrl(localShopImageUrl || shopImageUrl);
  }, [shopImageUrl, localShopImageUrl]);

  // 컴포넌트 언마운트 시 또는 이미지 URL이 변경될 때 이전 로컬 URL 해제
  useEffect(() => {
    return () => {
      if (localShopImageUrl) {
        URL.revokeObjectURL(localShopImageUrl);
      }
    };
  }, [shopImageUrl, localShopImageUrl]);

  // 비밀번호 가시성 토글 함수
  const togglePassword = () => {
    setOpenPassword(prev => !prev);
  };

  /** 파일 선택 핸들러 */
  const handleFileSelect = async file => {
    if (localShopImageUrl) {
      URL.revokeObjectURL(localShopImageUrl);
    }

    if (file) {
      const newLocalUrl = URL.createObjectURL(file);
      setLocalShopImageUrl(newLocalUrl);
      setDisplayImageUrl(newLocalUrl);

      onShopImageChange(file);
      onBlur('shopImage', newLocalUrl);
    } else {
      // 파일 선택 취소 또는 파일 없음
      setLocalShopImageUrl(null);
      setDisplayImageUrl(shopImageUrl);
      onShopImageChange(null);
    }
  };

  /** 이미지 삭제 핸들러 */
  const handleDeleteImage = () => {
    if (localShopImageUrl) {
      URL.revokeObjectURL(localShopImageUrl);
    }
    setLocalShopImageUrl(null);
    setDisplayImageUrl(null);
    onRemoveShopImage();
    onBlur('shopImage', null);
  };

  const containerHasError = Object.values(formErrors).some(
    error => error.hasError,
  );

  return (
    <ShopSectionWrapper>
      <ShopTitle>내 쇼핑몰</ShopTitle>
      <Container hasError={containerHasError}>
        <PreviewGroup>
          <TextGroup>
            <Wrapper>
              <ShopImg>프로필 이미지</ShopImg>
              <Description>상품 이미지를 첨부해주세요.</Description>
            </Wrapper>
            <FileField
              onFileChange={handleFileSelect}
              inputId='shop-image-upload'
            />
          </TextGroup>
          {formErrors?.shopImage.hasError && (
            <ErrorMessage>{formErrors?.shopImage.message}</ErrorMessage>
          )}{' '}
          {displayImageUrl && (
            <ImgGroup>
              <PreviewImg src={displayImageUrl} alt='상점 이미지' />
              <DeleteBtn onClick={handleDeleteImage}>
                <ButtonX src={DeleteImg} alt='이미지 삭제' />
              </DeleteBtn>
            </ImgGroup>
          )}
        </PreviewGroup>

        <Field
          type='text'
          inputId='name'
          label='이름'
          placeholder='표시하고 싶은 이름을 적어 주세요.'
          value={formData.name}
          onChange={onChange}
          hasError={formErrors.name.hasError}
          errorMessage={formErrors.name.message}
          onBlur={() => onBlur('name', formData.name)}
        />

        <Field
          type='url'
          inputId='url'
          label='Url'
          placeholder='Url을 입력해주세요.'
          value={formData.url}
          onChange={onChange}
          hasError={formErrors.url.hasError}
          errorMessage={formErrors.url.message}
          onBlur={() => onBlur('url', formData.url)}
        />

        <Field
          type='text'
          inputId='userId'
          label='유저 ID'
          placeholder='유저 ID를 입력해주세요.'
          value={formData.userId}
          onChange={onChange}
          hasError={formErrors.userId.hasError}
          errorMessage={formErrors.userId.message}
          onBlur={() => onBlur('userId', formData.userId)}
          autoComplete='username'
        />

        <TextGroup>
          <Field
            type={openPassword ? 'text' : 'password'}
            inputId='password'
            label='비밀번호'
            placeholder='비밀번호를 입력해주세요.'
            value={formData.password}
            onChange={onChange}
            hasError={formErrors.password.hasError}
            errorMessage={formErrors.password.message}
            onBlur={() => onBlur('password', formData.password)}
            autoComplete={openPassword ? 'off' : 'current-password'}
          />
          <CloseEyeIcon
            src={openPassword ? openEyeIcon : closeEyeIcon}
            alt='비밀번호 토글 아이콘'
            width={DEFAULT_EYE_SIZE}
            onClick={togglePassword}
          />
        </TextGroup>
      </Container>
    </ShopSectionWrapper>
  );
};

export default UpdateShop;
