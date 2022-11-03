import React from "react";
import Pagination from "react-js-pagination";

function Page(props) {


    return (
        <div>
            {props.totalItemsCount > 0 &&
                <Pagination
                    activePage={props.activePage}
                    itemsCountPerPage={props.itemsCountPerPage}
                    totalItemsCount={props.totalItemsCount}
                    pageRangeDisplayed={10}
                    itemClass="page-item"
                    linkClass="page-link"
                    onChange={(pageNumber) => props.handlePageChange(pageNumber)}
                />
            }
        </div>
    );
}

export default Page;