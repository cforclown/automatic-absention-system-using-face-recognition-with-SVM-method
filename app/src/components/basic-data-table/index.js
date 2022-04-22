/* eslint-disable react/display-name */
import React from 'react';
import PropTypes from 'prop-types';
import BaseTable, { AutoResizer, Column } from 'react-base-table';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// eslint-disable-next-line react/prop-types
const actionCellRenderer = (onEdit, onDelete) => ({ rowData }) => (
  <>
    {
      onEdit && <button type="button" className="btn btn-warning" style={{ marginRight: "8px" }} onClick={onEdit} >
        <FontAwesomeIcon size="sm" icon={["fas", "pencil-alt"]} />
      </button>
    }
    {
      onDelete && <button type="button" className="btn btn-danger" onClick={() => onDelete(rowData._id)} >
        <FontAwesomeIcon size="sm" icon={["fas", "trash"]} />
      </button>
    }
  </>
);

function BasicDataTable({
  data,
  columns,
  pagination,
  onPageClick,
  sort,
  onSort,
  disabled,
  onEdit,
  onDelete,
}) {
  const columnItems = columns.concat(onEdit || onDelete ? [
    {
      key: "action",
      title: "Action",
      dataKey: "action",
      width: 120,
      resizable: false,
      sortable: false,
      align: Column.Alignment.RIGHT,
      frozen: Column.FrozenDirection.RIGHT,
      cellRenderer: actionCellRenderer(onEdit, onDelete)
    }
  ] : []);

  return (
    <div className='cl-basic-data-table'>
      <AutoResizer>
        {({ width, height }) => {
          return (
            <BaseTable
              key={0}
              fixed
              width={width}
              height={height}
              columns={columnItems}
              data={data}
              disabled={disabled}
              sortBy={sort}
              onColumnSort={onSort}
            />
          );
        }}
      </AutoResizer>
      {
        pagination &&
        <div className='cl-basic-data-table-pagination'>
          <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            onPageChange={onPageClick}
            pageRangeDisplayed={5}
            pageCount={pagination.pageCount}
            previousLabel="< previous"
            renderOnZeroPageCount={null}
          />
        </div>
      }
    </div>
  );
}

BasicDataTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  pagination: PropTypes.object,
  onPageClick: PropTypes.func,
  sort: PropTypes.object,
  onSort: PropTypes.func,
  disabled: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};

export default BasicDataTable;
