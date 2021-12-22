import React from 'react'
import { DataGrid, GridToolbarContainer, GridToolbarExport, gridClasses, GridToolbarColumnsButton, GridToolbarFilterButton, GridToolbarDensitySelector} from '@mui/x-data-grid';
import CircularProgress from '@mui/material/CircularProgress';

function DataTable(props) {
    //Props needed: content, columns, pageSize, toolbar
    const [pageSize, setPageSize] = React.useState(props.pageSize);

    return (
        <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ flexGrow: 1 }}>
                {props.content ? (
                    <DataGrid
                        autoHeight 
                        rows={props.content}
                        columns={props.columns}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        rowsPerPageOptions={props.rowsPerPageOptions}
                        components={{
                            Toolbar: props.toolbar,
                        }}
                    />
                ) : (
                    <CircularProgress />
                )}
            </div>
        </div>
    )
}

function DefaultToolbar() {
    return (
      <GridToolbarContainer className={gridClasses.toolbarContainer}>
        <GridToolbarExport />
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
      </GridToolbarContainer>
    );
}

DataTable.defaultProps = {
    columns: [{field: "id", headerName: "ID"}],
    pageSize: 10,
    rowsPerPageOptions: [5, 10, 25, 50, 100],
    toolbar: DefaultToolbar,
}

export default DataTable