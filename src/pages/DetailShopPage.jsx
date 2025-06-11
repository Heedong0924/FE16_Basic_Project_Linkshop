// src/pages/DetailShopPage.jsx
import { useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { createLike, getLinkshopDetail, deleteLinkshop } from '../api/api';
import DeskTopBackgroundImg from '../assets/img/img_detailpage_bg_desktop.png';
import BackgroundImg from '../assets/img/img_detailpage_bg_mobile.png';
import TabletBackgroundImg from '../assets/img/img_detailpage_bg_tablet.png';
import LinkHeader from '../components/LinkHeader';
import PasswordModal from '../components/PasswordModal';
import ProductList from '../components/ProductList';
import ShopProfileCard from '../components/ShopProfileCard';
import { useOptimisticUpdate } from '../hooks/useOptimisticUpdate';
import Toast from '../Toast';
import { useAsync } from './../hooks/useAsync';

// --- 페이지 레벨 Styled Components ---
const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #ffffff;
`;

const MainContentLayoutWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  @media (min-width: 768px) and (max-width: 1023px) {
    max-width: 720px;
  }
  @media (min-width: 1024px) {
    max-width: 960px;
  }
`;

const HeroSection = styled.div`
  width: 100%;
  padding-top: 18.6667%;

  background-image: url(${BackgroundImg});
  background-size: 100%;
  background-repeat: repeat-x;
  background-position: top center;
  @media (min-width: 768px) {
    padding-top: 10.335%;
    background-image: url(${TabletBackgroundImg});
  }
  @media (min-width: 1024px) {
    padding-top: 3.9764%;
    background-image: url(${DeskTopBackgroundImg});
  }
`;

const ContentContainer = styled.main`
  margin: 0 auto;
  padding: 0 25px;
  width: 100%;
`;
// --- End of 페이지 레벨 Styled Components ---

const DetailShopPage = () => {
  // --- 상태 관리 및 핸들러, 데이터는 이전과 동일하게 유지 ---
  const navigate = useNavigate();
  const {
    state: { id },
  } = useLocation();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const [toastMessage, setToastMessage] = useState('');

  const { data: shopInfo, execute: getLinkshop } = useAsync(getLinkshopDetail, {
    delayLoadingTransition: false,
  });

  const showToast = message => {
    setToastMessage('');
    setTimeout(() => {
      setToastMessage(message);
    }, 0);
  };

  const { execute: toggleLike } = useOptimisticUpdate(
    createLike,
    () => {
      setIsLiked(prev => !prev);
      setCurrentLikeCount(prev => (!isLiked ? prev + 1 : prev - 1));
    },
    () => {
      setIsLiked(prev => !prev);
      setCurrentLikeCount(prev => (!isLiked ? prev - 1 : prev + 1));
    },
  );

  const [isLiked, setIsLiked] = useState(false);
  const [currentLikeCount, setCurrentLikeCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getLinkshop(id);
    setCurrentLikeCount(data.likes);
  };

  const handleGoBack = () => {
    navigate('/list');
  };

  const handleToggleActionMenu = () => {
    setIsActionMenuOpen(prev => !prev);
  };

  const handleEditClick = () => {
    navigate(`/link/${shopInfo.userId}/edit`, { state: { id: id } });
  };

  const handleDeleteClick = () => {
    setIsActionMenuOpen(false);
    setPasswordError('');
    setIsPasswordModalOpen(true);
  };

  const handlePasswordSubmit = async password => {
    if (!password) {
      setPasswordError('비밀번호를 입력해주세요.');
      return;
    }
    // ... (비밀번호 유효성 검사) ...
    try {
      await deleteLinkshop(id, password);

      // --- 성공했을 때 실행될 코드 ---
      setIsPasswordModalOpen(false);
      setToastMessage('삭제 완료!');
      setTimeout(() => {
        navigate('/list');
      }, 1000);
    } catch (error) {
      // --- 실패했을 때 실행될 코드 ---
      const errorMessage = error.response?.data?.message;
      if (
        errorMessage === 'Bad Request' || // "잘못된 요청"은 보통 비밀번호 불일치를 의미
        errorMessage === 'Validation Failed'
      ) {
        // ✅ 우리가 원하는 친절한 메시지로 설정합니다.
        setPasswordError('비밀번호가 일치하지 않습니다.');
      } else {
        // 그 외 예상치 못한 다른 모든 서버 에러에 대한 처리
        setPasswordError('오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };
  const handleCloseModal = () => {
    setIsPasswordModalOpen(false);
    setPasswordError('');
  };

  const handleLikeClick = () => {
    toggleLike(id);
  };

  return (
    <PageWrapper>
      <HeroSection />
      <MainContentLayoutWrapper>
        <LinkHeader onGoBack={handleGoBack} />
        <ContentContainer>
          <ShopProfileCard
            shopInfo={shopInfo}
            onShowToast={showToast}
            currentLikeCount={currentLikeCount}
            isLiked={isLiked}
            handleToggleLike={handleLikeClick}
            onMoreOptionsClick={handleToggleActionMenu}
            isActionMenuOpen={isActionMenuOpen}
            onEditActionClick={handleEditClick}
            onDeleteActionClick={handleDeleteClick}
          />
          <ProductList title='대표 상품' shopInfo={shopInfo} />
        </ContentContainer>
      </MainContentLayoutWrapper>
      {isPasswordModalOpen && (
        <PasswordModal
          isOpen={isPasswordModalOpen}
          onClose={handleCloseModal}
          onSubmit={handlePasswordSubmit}
          error={passwordError}
          title='정말로 삭제하시겠습니까?'
          description={'삭제를 원하시면 비밀번호를 입력해주세요.'}
          submitButtonText='삭제하기'
        />
      )}
      <Toast message={toastMessage} />
    </PageWrapper>
  );
};

export default DetailShopPage;
