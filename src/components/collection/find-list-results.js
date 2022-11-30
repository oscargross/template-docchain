import { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import {
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Button
} from '@mui/material';
import { ColorButton } from '../ConnectButton';

export const SBTsListResults = ({ sbts, toSign, approve, disableButton, profile }) => {

  const [selectedSBTsIds, setSelectedSBTsIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const router = useRouter();

  const handleSelectAll = (event) => {
    let newSelectedSBTsIds;

    if (event.target.checked) {
      newSelectedSBTsIds = sbts.map((sbt) => sbt.id);
    } else {
      newSelectedSBTsIds = [];
    }

    setSelectedSBTsIds(newSelectedSBTsIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedSBTsIds.indexOf(id);
    let newSelectedSBTsIds = [];

    if (selectedIndex === -1) {
      newSelectedSBTsIds = newSelectedSBTsIds.concat(selectedSBTsIds, id);
    } else if (selectedIndex === 0) {
      newSelectedSBTsIds = newSelectedSBTsIds.concat(selectedSBTsIds.slice(1));
    } else if (selectedIndex === selectedSBTsIds.length - 1) {
      newSelectedSBTsIds = newSelectedSBTsIds.concat(selectedSBTsIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedSBTsIds = newSelectedSBTsIds.concat(
        selectedSBTsIds.slice(0, selectedIndex),
        selectedSBTsIds.slice(selectedIndex + 1)
      );
    }

    setSelectedSBTsIds(newSelectedSBTsIds);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Card>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedSBTsIds.length === sbts.length}
                    color="primary"
                    indeterminate={
                      selectedSBTsIds.length > 0
                      && selectedSBTsIds.length < sbts.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  SBT
                </TableCell>
                <TableCell>
                  {(toSign || profile) ? 'Contract' : 'Recipient'}
                </TableCell>
                <TableCell>
                  Creation date
                </TableCell>
                <TableCell>
                  Approval date
                </TableCell>
                <TableCell>
                  Accepted
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sbts.slice((limit * page), (limit * (page + 1))).map((sbt) => (
                <TableRow
                  hover
                  key={sbt.id}
                  selected={selectedSBTsIds.indexOf(sbt.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedSBTsIds.indexOf(sbt.id) !== -1}
                      onChange={(event) => handleSelectOne(event, sbt.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                        cursor: 'pointer'
                      }}
                    >
                      <a href={`https://ipfs.io/ipfs/${sbt.id}`} rel="noopener noreferrer" target={'_blank'}>{sbt.id.slice(0, 7) + '...'}</a>
                    </Box>
                  </TableCell>
                  <TableCell sx={{
                    cursor: 'pointer',
                    ":hover": {
                      color: "blue"
                    }
                  }}>
                    {(toSign || profile)
                      ? <span onClick={() => { router.replace(sbt.contract) }}>
                        {sbt.contract}
                      </span>
                      : sbt.recipient}
                  </TableCell>
                  <TableCell>
                    {sbt.date}
                  </TableCell>
                  <TableCell sx={{ paddingLeft: '20px' }}>
                    {sbt?.mintDate ? sbt.mintDate : '-'}
                  </TableCell>
                  <TableCell sx={{ paddingLeft: '20px' }}>
                    {toSign
                      ? <ColorButton disabled={(disableButton && disableButton == sbt.id) ? true : false} variant="contained" onClick={() => approve(sbt.contract, sbt.id)} >Approve</ColorButton>
                      : sbt?.accepted ? <ThumbUpAltIcon /> : <ThumbDownAltIcon />
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={sbts.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

SBTsListResults.propTypes = {
  sbts: PropTypes.array.isRequired
};
