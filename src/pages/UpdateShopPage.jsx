import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';

import LoadingIndicator from '../components/LoadingIndicator';
import UpdateModal from '../components/ConfirmCreateModal';
import UpdateProduct from '../components/UpdateProduct';
import UpdateShop from '../components/UpdateShop';
import BaseButton from '../components/PrimaryButton';
import theme from '../styles/theme';
import { getLinkshopDetail, updateLinkshop, uploadImage } from '../api/api';

const Container = styled.form`
  margin-top: 124px;
  padding: 0 0.75rem;
`;

const BtnWrapper = styled.div`
  max-width: 696px;
  margin: 0 auto 124px;

  @media (min-width: 768px) {
    max-width: 696px;
  }
`;

const StButton = styled(BaseButton)`
  width: 100%;
  height: 50px;
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.colors.secGray200 : theme.colors.primary};
  color: ${theme.colors.secWhite100};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;

const UpdateShopPage = ({ onSuccess }) => {
  const [shopData, setShopData] = useState(null);
  const [productFormData, setProductFormData] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [shopImageUrl, setShopImageUrl] = useState(null);
  const [formData, setFormdata] = useState({
    name: '',
    url: '',
    userId: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({
    name: { hasError: false, message: '' },
    url: { hasError: false, message: '' },
    userId: { hasError: false, message: '' },
    password: { hasError: false, message: '' },
    shopImage: { hasError: false, message: '' },
  });
  const [productErrors, setProductErrors] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const { URLid } = useParams();

  /** 상품 추가 핸들러 */
  const handleAddProduct = () => {
    setProductFormData(prev => [...prev, { name: '', price: '' }]);
    setProductErrors(prev => [
      ...prev,
      {
        name: { hasError: false, message: '' },
        price: { hasError: false, message: '' },
        productImage: { hasError: false, message: '' },
      },
    ]);
    setProductImages(prev => [...prev, null]);
  };

  /** 이미지 파일 변경 및 업로드 핸들러 */
  const handleImageChange = async (index, file) => {
    if (!file) {
      setProductImages(prev => {
        const updated = [...prev];
        updated[index] = null;
        return updated;
      });
      handleProductBlur(index, 'productImage', null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const imageUrl = await uploadImage(file);
      setProductImages(prev => {
        const updated = [...prev];
        updated[index] = imageUrl;
        return updated;
      });
      handleProductBlur(index, 'productImage', imageUrl);
    } catch (err) {
      console.error(`상품 ${index} 이미지 업로드 실패:`, err);
      setError(err.message || '이미지 업로드에 실패했습니다.');
      setProductImages(prev => {
        const updated = [...prev];
        updated[index] = null;
        return updated;
      });
      handleProductBlur(index, 'productImage', null);
    } finally {
      setIsLoading(false);
    }
  };

  /** 상점 대표 이미지 변경 및 업로드 핸들러 */
  const handleShopImageChange = async file => {
    if (!file) {
      setShopImageUrl(null);
      handleShopBlur('shopImage', null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const imageUrl = await uploadImage(file);
      setShopImageUrl(imageUrl);
      handleShopBlur('shopImage', imageUrl);
    } catch (err) {
      console.error('상점 이미지 업로드 실패:', err);
      setError(err.message || '상점 이미지 업로드에 실패했습니다.');
      setShopImageUrl(null);
      handleShopBlur('shopImage', null);
    } finally {
      setIsLoading(false);
    }
  };

  /** 상점 대표 이미지 삭제 핸들러 */
  const handleRemoveShopImage = () => {
    setShopImageUrl(null);
    handleShopBlur('shopImage', null);
  };

  /** 유저 ID 유효성 검사 */
  const validateUserId = id => {
    if (id.trim() === '')
      return { hasError: true, message: '필수 입력 항목입니다.' };
    const regex = /^[a-zA-Z0-9]+$/;
    if (!regex.test(id)) {
      return {
        hasError: true,
        message: '아이디에 한글, 띄어쓰기, 특수기호를 사용할 수 없습니다.',
      };
    }
    return { hasError: false, message: '' };
  };

  /** 비밀번호 유효성 검사 */
  const validatePassword = password => {
    // 비밀번호 필드가 비어있으면 유효성 에러를 발생시키지 않음
    if (password.trim() === '') {
      return { hasError: false, message: '' };
    }
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!regex.test(password)) {
      return {
        hasError: true,
        message: '비밀번호는 영문+숫자 6자 이상을 입력해야 합니다.',
      };
    }
    return { hasError: false, message: '' };
  };

  /** 폼 전체 유효성 검사 (순수 함수) */
  const checkFormValidity = (
    currentFormData,
    currentProductFormData,
    currentShopImageUrl,
    currentProductImages,
    currentFormErrors,
    currentProductErrors,
  ) => {
    let overallValid = true;

    // 1. 기본 폼 필드 유효성 검사
    if (!currentFormData.name.trim()) {
      overallValid = false;
    }
    if (!currentFormData.url.trim()) {
      overallValid = false;
    }
    const userIdValidation = validateUserId(currentFormData.userId);
    if (userIdValidation.hasError) {
      overallValid = false;
    }

    // 2. 상품 폼 필드 유효성 검사
    currentProductFormData.forEach(product => {
      if (!product.name.trim() || !product.price.toString().trim()) {
        overallValid = false;
      }
    });

    // 4. 이미지 필드 유효성 검사
    if (!currentShopImageUrl) {
      overallValid = false;
    }
    currentProductImages.forEach(imageUrl => {
      if (!imageUrl) {
        overallValid = false;
      }
    });

    // 5. 현재 formErrors와 productErrors 객체 자체에 hasError: true가 있는지 확인
    const hasFormErrorsInState = Object.values(currentFormErrors).some(
      err => err.hasError,
    );
    const hasProductErrorsInState = currentProductErrors.some(prodErr =>
      Object.values(prodErr).some(err => err.hasError),
    );

    if (hasFormErrorsInState || hasProductErrorsInState) {
      overallValid = false;
    }

    return overallValid;
  };

  /** 초기 데이터 로드 */
  useEffect(() => {
    const fetchDetail = async () => {
      setError(null);
      setIsLoading(true);

      try {
        if (!URLid) {
          setError(
            '상세 정보를 불러올 수 없습니다: 페이지 ID가 누락되었습니다.',
          );
          return;
        }

        const data = await getLinkshopDetail(URLid);
        setShopData(data);
        setFormdata({
          name: data.name,
          url: data.shop?.shopUrl || '',
          userId: data.userId,
          password: '',
        });
        setProductFormData(
          (data.products || [])
            .filter(
              p => p && typeof p === 'object' && 'name' in p && 'price' in p,
            )
            .map(p => ({ name: p.name, price: p.price })) || [],
        );
        setShopImageUrl(data.shop?.imageUrl || null);

        setProductErrors(
          (data.products || []).map(() => ({
            name: { hasError: false, message: '' },
            price: { hasError: false, message: '' },
            productImage: { hasError: false, message: '' },
          })),
        );
        setProductImages((data.products || []).map(p => p.imageUrl || null));
      } catch (e) {
        console.error('상세 정보 로드 실패:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [URLid]);

  /** 폼 유효성 자동 확인 */
  useEffect(() => {
    if (shopData) {
      const isValid = checkFormValidity(
        formData,
        productFormData,
        shopImageUrl,
        productImages,
        formErrors,
        productErrors,
      );
      setIsFormValid(isValid);
    }
  }, [
    formData,
    productFormData,
    shopData,
    shopImageUrl,
    productImages,
    formErrors,
    productErrors,
  ]);

  /** 상품 정보 변경 핸들러 */
  const handleProductChange = (index, field, value) => {
    setProductFormData(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
    setProductErrors(prev => {
      const updated = [...prev];
      if (updated[index])
        updated[index][field] = { hasError: false, message: '' };
      return updated;
    });
  };

  /** 상품 필드 blur 시 유효성 검사 */
  const handleProductBlur = (index, field, value) => {
    let errorResult = { hasError: false, message: '' };

    if (field === 'productImage') {
      if (!value) {
        errorResult = {
          hasError: true,
          message: '상품 이미지를 첨부해주세요.',
        };
      }
    } else {
      const isEmpty = value.toString().trim() === '';
      errorResult = isEmpty
        ? { hasError: true, message: '필수 입력 항목입니다.' }
        : { hasError: false, message: '' };
    }
    setProductErrors(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index][field] = errorResult;
      }
      return updated;
    });
  };

  /** 상점 정보 변경 핸들러 */
  const handleChange = e => {
    const { id, value } = e.target;
    setFormdata(prev => ({ ...prev, [id]: value }));
    let result =
      id === 'userId'
        ? validateUserId(value)
        : id === 'password'
          ? validatePassword(value)
          : {
              hasError: value.trim() === '',
              message: value.trim() === '' ? '필수 입력 항목입니다.' : '',
            };
    setFormErrors(prev => ({ ...prev, [id]: result }));
  };

  /** 상점 필드 blur 시 유효성 검사 */
  const handleShopBlur = (id, value) => {
    let result;
    if (id === 'userId') {
      result = validateUserId(value);
    } else if (id === 'password') {
      // 비밀번호가 비어있으면 유효성 에러를 발생시키지 않음 (수정 안 함으로 간주)
      if (value.trim() === '') {
        result = { hasError: false, message: '' };
      } else {
        result = validatePassword(value);
      }
    } else if (id === 'shopImage') {
      if (!value) {
        result = { hasError: true, message: '상점 이미지를 첨부해주세요.' };
      } else {
        result = { hasError: false, message: '' };
      }
    } else {
      result = {
        hasError: value.trim() === '',
        message: value.trim() === '' ? '필수 입력 항목입니다.' : '',
      };
    }
    setFormErrors(prev => ({ ...prev, [id]: result }));
  };

  /** 개별 상품 삭제 핸들러 */
  const handleDeleteProduct = indexToDelete => {
    if (!window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      return;
    }
    setProductFormData(prev =>
      prev.filter((_, index) => index !== indexToDelete),
    );
    setProductImages(prev =>
      prev.filter((_, index) => index !== indexToDelete),
    );
    setProductErrors(prev =>
      prev.filter((_, index) => index !== indexToDelete),
    );
  };

  /** 모달 확인 버튼 핸들러 */
  const handleConfirm = () => {
    setIsModalOpen(false);
    onSuccess?.();
    navigate(`/link/${URLid}`);
  };

  /** 링크샵 수정 최종 제출 핸들러 */
  const handleUpdate = async () => {
    if (isSubmitting || isLoading) return;

    setError(null);
    setIsSubmitting(true);

    let overallValidForSubmission = true;
    const tempFormErrors = { ...formErrors };
    const tempProductErrors = [...productErrors];

    // 1. 기본 폼 필드 유효성 검사 (제출 시점에 한 번 더)
    for (const key in formData) {
      const value = formData[key];
      let result;
      if (key === 'userId') {
        result = validateUserId(value);
      } else if (key === 'password') {
        // password는 currentPassword이므로, 여기서는 에러 없도록 처리하고
        // 아래 currentPasswordValidation에서 필수 검사를 진행합니다.
        result = { hasError: false, message: '' };
      } else {
        result = {
          hasError: value.trim() === '',
          message: value.trim() === '' ? '필수 입력 항목입니다.' : '',
        };
      }
      tempFormErrors[key] = result;
      if (result.hasError) overallValidForSubmission = false;
    }

    // 상점 이미지 유효성 검사
    if (!shopImageUrl) {
      tempFormErrors.shopImage = {
        hasError: true,
        message: '상점 이미지를 첨부해주세요.',
      };
      overallValidForSubmission = false;
    } else {
      tempFormErrors.shopImage = { hasError: false, message: '' };
    }

    // 2. 상품 폼 필드 유효성 검사 (제출 시점에 한 번 더)
    productFormData.forEach((product, idx) => {
      const itemErrors = {
        name: { hasError: false, message: '' },
        price: { hasError: false, message: '' },
        productImage: { hasError: false, message: '' },
      };
      if (!product.name.trim())
        itemErrors.name = { hasError: true, message: '필수 입력 항목입니다.' };
      if (!product.price.toString().trim())
        itemErrors.price = { hasError: true, message: '필수 입력 항목입니다.' };

      // 상품 이미지 유효성 검사
      if (!productImages[idx]) {
        itemErrors.productImage = {
          hasError: true,
          message: '상품 이미지를 첨부해주세요.',
        };
      }

      if (
        itemErrors.name.hasError ||
        itemErrors.price.hasError ||
        itemErrors.productImage.hasError
      )
        overallValidForSubmission = false;
      tempProductErrors[idx] = itemErrors;
    });

    // 3. currentPassword 유효성 검사
    const currentPasswordValidation =
      formData.password.trim() === ''
        ? { hasError: true, message: '현재 비밀번호를 입력해주세요.' }
        : validatePassword(formData.password);
    tempFormErrors.password = currentPasswordValidation;
    if (currentPasswordValidation.hasError) overallValidForSubmission = false;

    // 최종 formErrors와 productErrors 상태 업데이트
    setFormErrors(tempFormErrors);
    setProductErrors(tempProductErrors);

    // 4. 최종 유효성 검사 결과에 따라 처리
    if (!overallValidForSubmission) {
      setIsSubmitting(false);
      return;
    }

    const dataToSubmit = {
      name: formData.name,
      userId: formData.userId,
      currentPassword: formData.password,
      shop: {
        shopUrl: formData.url,
        urlName: formData.url,
        imageUrl: shopImageUrl || null,
      },
      products: productFormData.map((p, index) => ({
        name: p.name,
        price: Number(p.price),
        imageUrl: productImages[index] || null,
      })),
    };

    try {
      await updateLinkshop(URLid, dataToSubmit);
      setIsModalOpen(true);
    } catch (err) {
      console.error('링크샵 수정 실패 (API 응답):', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container
      onSubmit={e => {
        e.preventDefault();
        handleUpdate();
      }}
    >
      {isLoading && !shopData && (
        <LoadingIndicator isLoading={isLoading} $isInitialLoad={true} />
      )}
      {!isLoading && shopData && (
        <>
          <UpdateProduct
            products={productFormData}
            onChange={handleProductChange}
            productErrors={productErrors}
            onBlur={handleProductBlur}
            onAddProduct={handleAddProduct}
            productImages={productImages}
            onImageChange={handleImageChange}
            onDeleteProduct={handleDeleteProduct}
          />
          <UpdateShop
            formData={formData}
            onChange={handleChange}
            formErrors={formErrors}
            onBlur={handleShopBlur}
            shopImageUrl={shopImageUrl}
            onShopImageChange={handleShopImageChange}
            onRemoveShopImage={handleRemoveShopImage}
          />
          <BtnWrapper>
            <StButton
              type='submit'
              onClick={handleUpdate}
              disabled={isLoading || isSubmitting || !isFormValid}
            >
              {isSubmitting ? '수정 중...' : '수정하기'}
            </StButton>
          </BtnWrapper>
        </>
      )}
      <UpdateModal
        onConfirm={handleConfirm}
        isOpen={isModalOpen}
        message='수정이 완료되었습니다.'
      />
    </Container>
  );
};

export default UpdateShopPage;
