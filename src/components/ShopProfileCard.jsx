// import React from 'react';

import styled from 'styled-components';

import Likes from './Likes';
import ProfileImage from './ProfileImage';
import MoreIcon from '../assets/icon/btn_kebap.png';
import ShareIcon from '../assets/icon/btn_share.png';
import { applyFontStyles } from '../styles/mixins'; // 경로 확인
import { ColorTypes, FontTypes } from '../styles/theme'; // 경로 확인

const StyledShopInfoWrapper = styled.div`
  background-color: #fafafb;
  padding: 24px 20px;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const ShopTopControls = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ActionIconsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  position: relative; /* <<< 매우 중요! */
`;

const IconButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  margin: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    display: block;
  }
`;

const ShopName = styled.h1`
  color: #1c1c1e;
  font-size: 32px;
  font-weight: 800;
  margin-top: 16px;
  margin-bottom: 4px;
`;

const ShopHandle = styled.p`
  ${applyFontStyles(FontTypes.REGULAR16, ColorTypes.SECONDARY_GRAY_300)}
  margin: 0 0 8px 0;
`;

const ActionMenu = styled.div`
  position: absolute;
  top: 100%; /* 아이콘 바로 아래 */
  right: 0;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  z-index: 20; /* 다른 요소 위에 오도록 */
  width: 160px; /* 메뉴 너비 */
  padding: 8px 0;
  border: 1px solid #dddddd;
`;

const ActionMenuItem = styled.button`
  display: block;
  width: 100%;
  padding: 10px 16px;
  text-align: center;
  background: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #dddddd;

  &:hover {
    background-color: rgb(231, 231, 231);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ShopProfileCard = ({
  shopInfo,
  isLiked,
  currentLikeCount,
  handleToggleLike,
  onShowToast,
  onMoreOptionsClick,
  isActionMenuOpen,
  onEditActionClick,
  onDeleteActionClick,
}) => {
  const handleShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      // 부모에게서 받은 함수를 호출해서 토스트를 띄워달라고 요청합니다.
      onShowToast('복사 완료!');
    } catch {
      onShowToast('복사 실패!');
    }
  };
  if (!shopInfo) return null;

  return (
    <StyledShopInfoWrapper>
      <ShopTopControls>
        <Likes
          onToggleLike={handleToggleLike}
          likes={currentLikeCount}
          isLiked={isLiked}
          id={shopInfo.id}
        />
        <ActionIconsGroup>
          <IconButton onClick={handleShareLink} aria-label='공유하기'>
            <img src={ShareIcon} alt='공유' />
          </IconButton>
          <IconButton onClick={onMoreOptionsClick} aria-label='더보기'>
            <img src={MoreIcon} alt='더보기' />
          </IconButton>
          {isActionMenuOpen && (
            <ActionMenu>
              <ActionMenuItem onClick={onEditActionClick}>
                수정하기
              </ActionMenuItem>
              <ActionMenuItem onClick={onDeleteActionClick}>
                삭제하기
              </ActionMenuItem>
            </ActionMenu>
          )}
        </ActionIconsGroup>
      </ShopTopControls>

      <ProfileImage src={shopInfo.shop.imageUrl} size='88px' />
      <ShopName>{shopInfo.name}</ShopName>
      <ShopHandle>@{shopInfo.userId}</ShopHandle>
    </StyledShopInfoWrapper>
  );
};

export default ShopProfileCard;
