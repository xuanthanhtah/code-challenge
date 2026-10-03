import type { TranslationDictionary } from '../types/i18n.types';

export const vi: TranslationDictionary = {
  tagline: 'Giao dịch token tức thì với tỉ giá tốt nhất.',
  footer: 'Dữ liệu giá từ Switcheo · Giao dịch mô phỏng cho mục đích demo',
  mockWallet: 'Ví thử nghiệm',

  swap: 'Đổi token',
  livePrices: 'Giá trực tiếp',
  pricesRefreshHint: 'Giá cập nhật mỗi 60s',
  switchTokens: 'Đổi chiều token',

  youPay: 'Bạn trả',
  youReceive: 'Bạn nhận',
  selectToken: 'Chọn token',
  balance: 'Số dư',
  quickAmount: 'Chọn nhanh',
  max: 'TỐI ĐA',

  invertRate: 'Đảo tỉ giá',
  maxSlippage: 'Trượt giá tối đa',
  minimumReceived: 'Nhận tối thiểu',
  networkFee: 'Phí mạng',
  route: 'Tuyến đường',

  confirmSwap: 'Xác nhận đổi',
  swapping: 'Đang xử lý…',
  swapFailed: 'Đổi thất bại',
  pleaseTryAgain: 'Vui lòng thử lại.',
  unknownError: 'Lỗi không xác định',
  validationSelectToken: 'Chọn token',
  validationEnterAmount: 'Nhập số tiền',
  validationInsufficientBalance: (symbol: string) => `Số dư ${symbol} không đủ`,
  validationAmountTooSmall: 'Số tiền quá nhỏ',

  swapSuccessful: 'Đổi token thành công',
  txHash: 'Mã giao dịch',
  swapAgain: 'Đổi tiếp',

  selectAToken: 'Chọn một token',
  searchBySymbol: 'Tìm theo ký hiệu token',
  paired: 'đang chọn',
  noTokensMatch: (query: string) => `Không tìm thấy token “${query}”`,
  onlyPricedTokens: 'Chỉ hỗ trợ giao dịch các token có niêm yết giá.',
  close: 'Đóng',

  couldNotLoadPrices: 'Không thể tải dữ liệu giá',
  tryAgain: 'Thử lại',
  somethingWentWrong: 'Đã có lỗi xảy ra.',
};
