import React, { useState }  from 'react'
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import EnvironmentService from "../services/environment.service";
import Snackbar from '@mui/material/Snackbar';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

function AddEnvironmentReport(props) {
    const [openModal, setOpenModal] = useState(false);

    const [carbonFootPrintValue, setCarbonFootprintValue] = useState();
    const [carbonDeviationValue, setCarbonDeviationValue] = useState();
    const [weightAssumption, setWeightAssumption] = useState();
    const [lifetimeAssumption, setLifetimeAssumption] = useState();
    const [useLocationAssumption, setUseLocationAssumption] = useState();
    const [assemblyLocationAssumption, setAssemblyLocationAssumption] = useState();
    const [source, setSource] = useState();
    const [reportCreated, setReportCreated] = useState();
    const [carbonManufacturing, setCarbonManufacturing] = useState();
    const [carbonTransportation, setCarbonTransportation] = useState();
    const [carbonEOL, setCarbonEOL] = useState();
    const [carbonUse, setCarbonUse] = useState();
    const [screensizeAssumption, setScreensizeAssumption] = useState();
    const [energyDemandAssumption, setEnergyDemandAssumption] = useState();

    const [openStatusMessage, setOpenStatusMessage] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");

    const handleClickOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleCloseMessage = () => {
        setOpenStatusMessage(false);
    };

    const handleAddEnvironment = (e) => {
        e.preventDefault();
        EnvironmentService.addEnvironment(props.id, carbonFootPrintValue,
                                            carbonDeviationValue, weightAssumption,
                                            lifetimeAssumption, useLocationAssumption,
                                            assemblyLocationAssumption, source,
                                            reportCreated, carbonManufacturing,
                                            carbonTransportation, carbonEOL,
                                            carbonUse, screensizeAssumption, energyDemandAssumption).then(
            response => {
                setOpenModal(false);
                setStatusMessage(response.data.message + ". Please refresh the page");
                setOpenStatusMessage(true);
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                setStatusMessage(resMessage);
                setOpenStatusMessage(true);
            }
        )
    }

    return (
        <div>
            <Button variant="text" startIcon={<AddIcon />} onClick={handleClickOpenModal}>Add environment report</Button>
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Add environment report</DialogTitle>
                <FormControl>
                    <form onSubmit={handleAddEnvironment}>
                        <DialogContent>
                            <Divider><Chip label="Information"/></Divider>
                            <TextField required autoFocus id="reportCreated" label="Report creation date" margin="dense" fullWidth variant="standard" value={reportCreated} onChange={e => setReportCreated(e.target.value)}/>
                            <TextField required id="source" label="Source" margin="dense" fullWidth variant="standard" value={source} onChange={e => setSource(e.target.value)}/>
                            
                            <Divider><Chip label="Carbon"/></Divider>

                            <TextField type="number" required id="carbonFootprint" label="Carbon Footprint" margin="dense" fullWidth variant="standard" value={carbonFootPrintValue} onChange={e => setCarbonFootprintValue(e.target.value)}/>
                            <TextField type="number" required id="carbonDeviation" label="Carbon Footprint Deviation" margin="dense" fullWidth variant="standard" value={carbonDeviationValue} onChange={e => setCarbonDeviationValue(e.target.value)}/>
                            
                            <Divider><Chip label="Carbon footprint categories"/></Divider>
                            <TextField type="number" required id="carbonManufacturing" label="Percentage of carbon in manufacturing" margin="dense" fullWidth variant="standard" value={carbonManufacturing} onChange={e => setCarbonManufacturing(e.target.value)}/>
                            <TextField type="number" required id="carbonTransportation" label="Percentage of carbon in transportation" margin="dense" fullWidth variant="standard" value={carbonTransportation} onChange={e => setCarbonTransportation(e.target.value)}/>
                            <TextField type="number" required id="carbonUse" label="Percentage of carbon in usage" margin="dense" fullWidth variant="standard" value={carbonUse} onChange={e => setCarbonUse(e.target.value)}/>
                            <TextField type="number" required id="carbonEOL" label="Percentage of carbon in EOL" margin="dense" fullWidth variant="standard" value={carbonEOL} onChange={e => setCarbonEOL(e.target.value)}/>
                            
                            <Divider><Chip label="Assumptions" /></Divider>
                            <TextField type="number" required id="weightAssumption" label="Weight (kg)" margin="dense" fullWidth variant="standard" value={weightAssumption} onChange={e => setWeightAssumption(e.target.value)}/>
                            <TextField type="number" required id="lifetimeAssumption" label="Lifetime (years)" margin="dense" fullWidth variant="standard" value={lifetimeAssumption} onChange={e => setLifetimeAssumption(e.target.value)}/>
                            <TextField required id="useLocationAssumption" label="Usage location" margin="dense" fullWidth variant="standard" value={useLocationAssumption} onChange={e => setUseLocationAssumption(e.target.value)}/>
                            <TextField required id="assemblyLocationAssumption" label="Assembly location" margin="dense" fullWidth variant="standard" value={assemblyLocationAssumption} onChange={e => setAssemblyLocationAssumption(e.target.value)}/>
                            <TextField type="number" id="energyDemandAssumption" label="Energy demand (kWh)" margin="dense" fullWidth variant="standard" value={energyDemandAssumption} onChange={e => setEnergyDemandAssumption(e.target.value)}/>
                            <TextField type="number" id="screensizeAssumption" label="Screen size" margin="dense" fullWidth variant="standard" value={screensizeAssumption} onChange={e => setScreensizeAssumption(e.target.value)}/>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseModal}>Cancel</Button>
                            <Button type="submit" color="primary" onClick={handleCloseModal}>Add</Button>
                        </DialogActions>
                    </form>
                </FormControl>
            </Dialog>
            <Snackbar open={openStatusMessage} autoHideDuration={6000} onClose={handleCloseMessage} message={statusMessage} />
        </div>
    )
}

export default AddEnvironmentReport
