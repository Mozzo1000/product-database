import React from 'react'
import PropTypes from 'prop-types'
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function CustomSnackbar ({
    message,
    action,
    ButtonProps,
    SnackbarProps,
    customParameters
    }) {
    return (
        <Snackbar {...SnackbarProps}>
        <Alert
            severity={customParameters?.type}
            action={
                <>
                  {action != null && (
                    <Button color='secondary' size='small' {...ButtonProps}>
                      {action}
                    </Button>
                  )}
                  <IconButton
                    aria-label='close'
                    color='inherit'
                    size='small'
                    onClick={SnackbarProps.onClose}>
                    <CloseIcon />
                  </IconButton>
                </>
              }>
            {message}
            
        </Alert>
        </Snackbar>
    )
}

CustomSnackbar.propTypes = {
    message: PropTypes.string,
    action: PropTypes.string,
    ButtonProps: PropTypes.object,
    SnackbarProps: PropTypes.object,
    customParameters: PropTypes.shape({
        type: PropTypes.oneOf(['error', 'warning', 'info', 'success'])
    })
}
