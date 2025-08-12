import ReactPaginate from "react-paginate";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface Props {
  /** 現在のページ番号（0ベース） */
  currentPage: number;
  /** 総ページ数 */
  totalPages: number;
  /** ページ変更ハンドラー */
  onPageChange: (page: number) => void;
}

/**
 * ページネーションコンポーネント
 * @description React-paginateを使用したページング機能
 */
export const Pagination: React.FC<Props> = ({ currentPage, totalPages, onPageChange }) => {
  /**
   * ページ変更ハンドラー
   * @param selectedItem - React-paginateから渡される選択されたページ情報
   */
  const handlePageClick = (selectedItem: { selected: number }) => {
    onPageChange(selectedItem.selected + 1); // 1ベースに変換
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center">
      <ReactPaginate
        previousLabel={
          <span className="flex items-center gap-1">
            <FiChevronLeft className="h-4 w-4" />
            Previous
          </span>
        }
        nextLabel={
          <span className="flex items-center gap-1">
            Next
            <FiChevronRight className="h-4 w-4" />
          </span>
        }
        breakLabel="..."
        pageCount={totalPages}
        marginPagesDisplayed={1}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        forcePage={currentPage - 1} // 0ベースに変換
        containerClassName="flex items-center gap-1"
        pageClassName="px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
        pageLinkClassName="block w-full h-full"
        activeClassName="bg-blue-500 text-white hover:bg-blue-600"
        previousClassName="px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        previousLinkClassName="block w-full h-full"
        nextClassName="px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        nextLinkClassName="block w-full h-full"
        disabledClassName="opacity-50 cursor-not-allowed pointer-events-none"
        breakClassName="px-3 py-2 text-sm"
      />
    </div>
  );
};
