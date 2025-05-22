import { jsxs, jsx, Fragment } from 'react/jsx-runtime';

const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
  const pageWindow = 5;
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
  return /* @__PURE__ */ jsxs("div", { className: "pagination", children: [
    /* @__PURE__ */ jsx("button", { className: "pagination-button", onClick: () => setCurrentPage(currentPage - 1), disabled: currentPage === 1, children: "Anterior" }),
    pageNumbers[0] > 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("button", { onClick: () => setCurrentPage(1), children: "1" }),
      pageNumbers[0] > 2 && /* @__PURE__ */ jsx("span", { children: "..." })
    ] }),
    pageNumbers.map((page) => /* @__PURE__ */ jsx(
      "button",
      {
        className: `pagination-number ${currentPage === page ? "active" : ""}`,
        onClick: () => setCurrentPage(page),
        children: page
      },
      page
    )),
    pageNumbers[pageNumbers.length - 1] < totalPages && /* @__PURE__ */ jsxs(Fragment, { children: [
      pageNumbers[pageNumbers.length - 1] < totalPages - 1 && /* @__PURE__ */ jsx("span", { children: "..." }),
      /* @__PURE__ */ jsx("button", { onClick: () => setCurrentPage(totalPages), children: totalPages })
    ] }),
    /* @__PURE__ */ jsx("button", { className: "pagination-button", onClick: () => setCurrentPage(currentPage + 1), disabled: currentPage === totalPages, children: "Siguiente" })
  ] });
};

export { Pagination as P };
