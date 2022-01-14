import React, { useState, useEffect }  from 'react'
import { styled } from '@mui/material/styles';
import { useParams, Link as RouterLink } from "react-router-dom";
import ProductService from "../services/product.service";
import AttributeService from "../services/attribute.service";
import CircularProgress from '@mui/material/CircularProgress';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import TabPanel from '../components/TabPanel';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import a11yProps from '../components/TabPanel';
import DocumentService from "../services/document.service";
import Snackbar from '@mui/material/Snackbar';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import SwipeableViews from 'react-swipeable-views';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import Popover from '@mui/material/Popover';
import HelpIcon from '@mui/icons-material/Help';
import Image from 'material-ui-image'
import EditProductAttribute from '../components/EditProductAttribute';
import RemoveProductAttribute from '../components/RemoveProductAttribute';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
const prettyBytes = require('pretty-bytes');

function ProductPage() {
    const [content, setContent] = useState();
    let { id } = useParams()
    const [tab, setTab] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [newAttributeName, setNewAttributeName] = useState();
    const [newAttributeValue, setNewAttributeValue] = useState();
    const [openStatusMessage, setOpenStatusMessage] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [loadUpload, setLoadUpload] = useState(false);
    const [documentContent, setDocumentContent] = useState([]);
    const [imageContent, setImageContent] = useState([]);
    const [activeStep, setActiveStep] = React.useState(0);
    const [anchorElHelp, setAnchorElHelp] = React.useState(null);
    const openHelp = Boolean(anchorElHelp);

    const handleClickHelp = (event) => {
        setAnchorElHelp(event.currentTarget);
      };
    
      const handleCloseHelp = () => {
        setAnchorElHelp(null);
      };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step) => {
        setActiveStep(step);
    };

    const Input = styled('input')({
        display: 'none',
    });
      
    const handleTabChange = (event, newTab) => {
        setTab(newTab);
    };

    const handleClickOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleCloseMessage = () => {
        setOpenStatusMessage(false);
    };

    const handleFileUpload = (e) => {
        console.log(e.target.files[0]);
        const fileData = e.target.files[0];
        if (fileData) {
            setLoadUpload(true);
            const data = new FormData();
            data.append('file', fileData);
            data.append('product_id', id);
            DocumentService.addDocument(data, id).then(
                response => {
                    console.log(response.data);
                    setStatusMessage(response.data.message);
                    setOpenStatusMessage(true);
                    setLoadUpload(false);
                    DocumentService.getAllDocuments(id).then(
                        response => {
                            setDocumentContent(response.data);
                        },
                        error => {
                            const resMessage =
                                (error.response &&
                                    error.response.data &&
                                    error.response.data.message) ||
                                error.message ||
                                error.toString();
                            console.log(resMessage);
                        }
                    )
                },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    console.log(resMessage);
                    setStatusMessage(resMessage);
                    setOpenStatusMessage(true);
                    setLoadUpload(false);
                }
            )
        }
    };

    const handleAddAttribute = (e) => {
        e.preventDefault();
        AttributeService.addAttribute(id, newAttributeName, newAttributeValue).then(
            () => {
                setOpenModal(false);
                ProductService.getProduct(id).then(
                    response => {
                        setContent(response.data);
                    },
                    error => {
                        const resMessage =
                            (error.response &&
                                error.response.data &&
                                error.response.data.message) ||
                            error.message ||
                            error.toString();
                        console.log(resMessage);
                    }
                )
            },
            (error) => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                console.log(resMessage);
            }
        );
    }

    useEffect(() => {
        ProductService.getProduct(id).then(
            response => {
                setContent(response.data);
                document.title = response.data.name + " - product-database"
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                console.log(resMessage);
            }
        )
        DocumentService.getAllDocuments(id).then(
            response => {
                setDocumentContent(response.data);
                console.log(response.data.length);
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                console.log(resMessage);
            }
        )
        DocumentService.getAllDocuments(id, "?type=image/").then(
            response => {
                setImageContent(response.data);
                console.log(response.data);
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                console.log(resMessage);
            }
        )
      }, []);

    const uploadFileButton = () => {
        return (
            <>            
            <label htmlFor="contained-button-file">
            <Input id="contained-button-file" multiple type="file" onChange={handleFileUpload}/>
            <Button variant="text" component="span">
                Upload file
            </Button>
            </label>
            <Button aria-describedby="popover" onClick={handleClickHelp}><HelpIcon /></Button>
            </>
        )
    }
    return (
        <Container sx={{paddingTop: 4}}>
            {content ? (
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Grid container spacing={6}>
                                    <Grid item xs={6}>
                                        <Breadcrumbs aria-label="breadcrumb">
                                            <Link component={RouterLink} underline="hover" color="inherit" to="/products">
                                                Products
                                            </Link>
                                            <Typography color="text.primary">{content.name}</Typography>
                                        </Breadcrumbs>
                                        {imageContent.length > 0 && 
                                            <>
                                            <SwipeableViews index={activeStep} onChangeIndex={handleStepChange} enableMouseEvents>
                                                {imageContent.map((image, index) => (
                                                    <div key={image.name}>
                                                        {Math.abs(activeStep - index) <= 2 ? (
                                                            <Image src={"http://localhost:5000/v1/documents/storage/" + image.name} style={{width: "100%", height: "100%", objectFit: "contain"}}/>
                                                        ): null}
                                                    </div>
                                                ))}
                                                </SwipeableViews>
                                                <MobileStepper position="static" steps={imageContent.length} activeStep={activeStep} variant="dots"
                                                    nextButton={
                                                        <Button size="small" onClick={handleNext} disabled={activeStep === imageContent.length - 1}>
                                                            Next
                                                            <KeyboardArrowRight />
                                                        </Button>
                                                    }
                                                    backButton={
                                                        <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                                                            <KeyboardArrowLeft />
                                                            Back
                                                        </Button>
                                                    }
                                                />
                                                </>
                                            }
                                        </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="h3">{content.name}</Typography>
                                        <Typography variant="subtitle">{new Date(content.created_at).toLocaleDateString()}</Typography><br /><br />
                                        <Typography variant="body1">{content.description}</Typography>
                                    </Grid>
                                    </Grid>
                            </CardContent>
                            <CardActions>
                                <Button size="small">Edit</Button>
                                <Button size="small" color="error">Delete</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Tabs value={tab} onChange={handleTabChange} aria-label="tabs">
                            <Tab label="Attributes" {...a11yProps(0)} />
                            <Tab label="Environment" {...a11yProps(1)} />
                            <Tab label="Documents" {...a11yProps(2)} />
                        </Tabs>
                        <TabPanel value={tab} index={0}>
                            <Card>
                                <CardHeader title={<Button variant="text" startIcon={<AddIcon />} onClick={handleClickOpenModal}>Add new</Button>} />
                                <CardContent>
                                    <TableContainer>
                                        <Table>
                                            <TableBody>
                                                {content.attribute.length > 0 ? (
                                                    content.attribute.map((attribute) => (
                                                        <TableRow key={attribute.name}>
                                                            <TableCell>{attribute.name}</TableCell>
                                                            <TableCell>{attribute.value}</TableCell>
                                                            <TableCell><EditProductAttribute props={attribute} /></TableCell>
                                                            <TableCell><RemoveProductAttribute props={attribute} /></TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <Typography>No attributes found</Typography>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </TabPanel>
                        <TabPanel value={tab} index={2}>
                            <Card>
                                <CardHeader title={uploadFileButton()} />
                                    <CardContent>
                                        <Popover id="popover" open={openHelp} anchorEl={anchorElHelp} onClose={handleCloseHelp} anchorOrigin={{vertical: "bottom", horizontal: "left"}}>
                                            <Typography sx={{ p: 2 }}>Uploading images will add them as cover images.</Typography>
                                        </Popover>
                                        {loadUpload && 
                                            <CircularProgress />
                                        }
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>File</TableCell>
                                                    <TableCell>Type</TableCell>
                                                    <TableCell>Size</TableCell>
                                                    <TableCell>Checksum (SHA256)</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {documentContent.length > 0 ? (
                                                    documentContent.map((document) => (
                                                        <TableRow key={document.name}>
                                                            {/*TODO: Remove the hardcoded api link. This is a temporary workaround because file download did not work through the proxy pass.*/}
                                                            <TableCell component="a" href={"http://localhost:5000/v1/documents/storage/" + document.name} target="_blank">{document.name}</TableCell>
                                                            <TableCell>{document.type}</TableCell>
                                                            {document.size === null ? (
                                                                <TableCell>{document.size}</TableCell>
                                                            ): (
                                                                <TableCell>{prettyBytes(document.size)}</TableCell>
                                                            )}
                                                            <TableCell>{document.checksum}</TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <Typography>No documents found</Typography>
                                                )}  
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </TabPanel>
                    </Grid>
                </Grid>
            ) : (
                <CircularProgress />
            )}
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Add new attribute</DialogTitle>
                <FormControl>
                    <form onSubmit={handleAddAttribute}>
                        <DialogContent>
                            <DialogContentText>
                                Fill out the information below
                            </DialogContentText>
                            <TextField required autofocus id="name" label="Name" margin="dense" fullWidth variant="standard" value={newAttributeName} onChange={e => setNewAttributeName(e.target.value)}/>
                            <TextField required autofocus id="value" label="Value" margin="dense" fullWidth variant="standard" value={newAttributeValue} onChange={e => setNewAttributeValue(e.target.value)}/>

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseModal}>Cancel</Button>
                            <Button type="submit" color="primary" onClick={handleCloseModal}>Add</Button>
                        </DialogActions>
                    </form>
                </FormControl>
            </Dialog>
            <Snackbar open={openStatusMessage} autoHideDuration={6000} onClose={handleCloseMessage} message={statusMessage} />
        </Container>
    )
}

export default ProductPage
