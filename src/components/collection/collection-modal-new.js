import React, { useState } from 'react';

import { Button, TextField, Typography, Modal, FormControlLabel, Box, Checkbox } from '@mui/material';
import { FileUploader } from "react-drag-drop-files";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  height: 300,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
};
const fileTypes = ["JPG", "PNG", "GIF"];

export default ({ create, open, handleOpen, sbt, setField, field, handleChangeFile, setCheck,fee, file}) => {


  return (
    <div>
      <Modal
        open={open}
        onClose={handleOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              '& .MuiTextField-root': { marginTop: 4 },
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              New {sbt ? 'SBT' : 'Collection'}
            </Typography>
            <TextField
              margin="dense"
              required
              error={(sbt && !field) ? true : false}
              id="name"
              label={sbt ? 'Recipient address' : 'Collection name'}
              fullWidth
              onChange={e => setField(e.target.value.trim())}
            />
            {!sbt && <FormControlLabel control={<Checkbox onChange={e => setCheck(e.target.checked)} />} label="This collection will be used to store my files" />}
            {sbt && <Box style={{ marginTop: '10px' }}>
              <FileUploader
                handleChange={handleChangeFile}
                multiple={false}
                label='Drop the file here'
                hoverTitle='Drop here'
                name="file"
                types={fileTypes}
              />
            </Box>
            }
            {fee && <p style={{ fontSize: '13px'}}>
              The current value of mint is: {fee} ETH </p>}
            <Button
              // disabled={(!field || !file) && true}
              variant="contained" sx={{ m: 2 }}
              onClick={async () => await create()}>
              Create
              </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}
