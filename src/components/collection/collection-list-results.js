import { useState, useEffect } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { useRouter } from 'next/router';

import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { NavItem } from '../nav-item';
export const CollectionsListResults = ({ collections }) => {
  const [selectedCollectionIds, setSelectedCollectionIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const router = useRouter();

  const handleSelectAll = (event) => {
    let newSelectedCollectionIds;

    if (event.target.checked) {
      newSelectedCollectionIds = collections.map((collection) => collection.id);
    } else {
      newSelectedCollectionIds = [];
    }

    setSelectedCollectionIds(newSelectedCollectionIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCollectionIds.indexOf(id);
    let newSelectedCollectionIds = [];

    if (selectedIndex === -1) {
      newSelectedCollectionIds = newSelectedCollectionIds.concat(selectedCollectionIds, id);
    } else if (selectedIndex === 0) {
      newSelectedCollectionIds = newSelectedCollectionIds.concat(selectedCollectionIds.slice(1));
    } else if (selectedIndex === selectedCollectionIds.length - 1) {
      newSelectedCollectionIds = newSelectedCollectionIds.concat(selectedCollectionIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedCollectionIds = newSelectedCollectionIds.concat(
        selectedCollectionIds.slice(0, selectedIndex),
        selectedCollectionIds.slice(selectedIndex + 1)
      );
    }

    setSelectedCollectionIds(newSelectedCollectionIds);
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
                    checked={selectedCollectionIds.length === collections.length}
                    color="primary"
                    indeterminate={
                      selectedCollectionIds.length > 0
                      && selectedCollectionIds.length < collections.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Address
                </TableCell>
                <TableCell>
                  Nº of SBTs
                </TableCell>
                <TableCell>
                  Creation date
                </TableCell>
                <TableCell>
                  Access
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {collections.slice((limit * page), (limit * (page + 1))).map((collection) => (

                <TableRow
                  hover
                  key={collection.id}
                  selected={selectedCollectionIds.indexOf(collection.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCollectionIds.indexOf(collection.id) !== -1}
                      onChange={(event) => handleSelectOne(event, collection.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {collection.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {collection.id}
                  </TableCell>
                  <TableCell>
                    {collection.sbts}
                  </TableCell>

                  <TableCell>
                    {collection.date}
                    {/* {format(collection.createdAt, 'dd/MM/yyyy')} */}
                  </TableCell>
                  <TableCell onClick={() => {
                    router.replace(collection.id)
                  }} sx={{ cursor: 'pointer' }}>
                    <LoginIcon />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={collections.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

CollectionsListResults.propTypes = {
  collections: PropTypes.array.isRequired
};
