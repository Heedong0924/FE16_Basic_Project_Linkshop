// src/pages/DetailShopPage.jsx
import { useCallback, useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import {
  createLike,
  getLinkshopDetail,
  deleteLinkshop,
  deleteLike,
} from '../api/api';
import DeskTopBackgroundImg from '../assets/img/img_detailpage_bg_desktop.png';
import BackgroundImg from '../assets/img/img_detailpage_bg_mobile.png';
import BackgroundImgPart from '../assets/img/img_detailpage_bg_part.png';
import LinkHeader from '../components/LinkHeader';
import PasswordModal from '../components/PasswordModal';
import ProductList from '../components/ProductList';
import ShopProfileCard from '../components/ShopProfileCard';
import { useOptimisticUpdate } from '../hooks/useOptimisticUpdate';
import Toast from '../Toast';
import LoadingIndicator from './../components/LoadingIndicator';
import { useAsync } from './../hooks/useAsync';

// --- 페이지 레벨 Styled Components ---
const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #ffffff;
`;

const MainContentLayoutWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  transition: 0.3s linear all;
  @media (min-width: 768px) {
    max-width: 720px;
  }
  @media (min-width: 1024px) {
    max-width: 960px;
  }
`;

const HeroSection = styled.div`
  width: 100%;
  height: 64px;
  background-image: url(${BackgroundImg});
  background-repeat: repeat-x;
  background-size: auto 100%; /* 높이에 맞춰 비율 유지 */
  background-position: top center;

  @media (min-width: 768px) {
    background-image: url(${BackgroundImgPart});
  }

  @media (min-width: 1024px) {
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

  const {
    data: shopInfo,
    isLoading,
    execute: getLinkshop,
  } = useAsync(getLinkshopDetail, {
    delayLoadingTransition: false,
  });

  const storedValue =
    window.localStorage.getItem(`cardIsLiked_${id}`) ?? 'false';
  const [isLiked, setIsLiked] = useState(storedValue === 'true');
  const [currentLikeCount, setCurrentLikeCount] = useState(0);

  const { execute: addLike } = useOptimisticUpdate(
    createLike,
    useCallback(() => {
      setIsLiked(true);
      setCurrentLikeCount(prev => prev + 1);
    }, []),
    useCallback(() => {
      setIsLiked(false);
      setCurrentLikeCount(prev => prev - 1);
    }, []),
  );

  const { execute: removeLike } = useOptimisticUpdate(
    deleteLike,
    useCallback(() => {
      setIsLiked(false);
      setCurrentLikeCount(prev => prev - 1);
    }, []),
    useCallback(() => {
      setIsLiked(true);
      setCurrentLikeCount(prev => prev + 1);
    }, []),
  );

  const handleToggleLike = useCallback(
    async (id, currentIsLiked) => {
      try {
        if (!currentIsLiked) {
          await addLike(id);
        } else {
          await removeLike(id);
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    [addLike, removeLike],
  );

  const loadData = async () => {
    const data = await getLinkshop(id);
    setCurrentLikeCount(data.likes);
  };

  const showToast = message => {
    setToastMessage('');
    setTimeout(() => {
      setToastMessage(message);
    }, 0);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    window.localStorage.setItem(`cardIsLiked_${id}`, String(isLiked));
  }, [isLiked]);

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
    // ... (비밀번호 유효성 검사) ...
    if (!password) {
      setPasswordError('비밀번호를 입력해주세요.');
      return;
    }
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
        errorMessage === 'Bad Request' ||
        errorMessage === 'Validation Failed'
      ) {
        setPasswordError('비밀번호가 올바르지 않습니다.');
      } else {
        setPasswordError(
          errorMessage || '삭제에 실패했습니다. 다시 시도해주세요.',
        );
      }
    }
  };

  const handleCloseModal = () => {
    setIsPasswordModalOpen(false);
    setPasswordError('');
  };

  return (
    <PageWrapper>
      <HeroSection />
      <MainContentLayoutWrapper>
        <LinkHeader onGoBack={handleGoBack} />
        <ContentContainer>
          <ShopProfileCard
            shopInfo={shopInfo}
            currentLikeCount={currentLikeCount}
            isLiked={isLiked}
            handleToggleLike={() => handleToggleLike(id, isLiked)}
            onShowToast={showToast}
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
      <LoadingIndicator
        $isLoading={isLoading}
        $hasMore={true}
        $isInitialLoad={true}
      />
      <Toast message={toastMessage} />
    </PageWrapper>
  );
};

export default DetailShopPage;
