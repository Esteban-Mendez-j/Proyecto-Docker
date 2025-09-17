const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
  const pageWindow = 5; // Máximo de botones visibles

  const getPageNumbers = () => {
    let start = Math.max(1, currentPage - Math.floor(pageWindow / 2));
    let end = start + pageWindow - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - pageWindow + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination">
      <button className="pagination-button" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
        Anterior
      </button>

      {pageNumbers[0] > 1 && (
        <>
          <button onClick={() => setCurrentPage(1)}>1</button>
          {pageNumbers[0] > 2 && <span>...</span>}
        </>
      )}

      {pageNumbers.map((page) => (
        <button
          key={page}
          className={`pagination-number ${currentPage === page ? 'active' : ''}`}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      ))}

      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span>...</span>}
          <button onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
        </>
      )}

      <button className="pagination-button" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
        Siguiente
      </button>
    </div>
  );
};

export default Pagination;