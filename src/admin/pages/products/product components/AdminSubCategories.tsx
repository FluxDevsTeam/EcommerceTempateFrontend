import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Typography,
  Alert,
  Box,
} from '@mui/material';

interface Category {
  id: number;
  name: string;
}

interface SubCategory {
  id: number;
  category: Category;
  name: string;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SubCategory[];
}

const AdminSubCategories: React.FC = () => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [totalCount, setTotalCount] = useState<number>(0);

  const API_BASE_URL = 'https://ecommercetemplate.pythonanywhere.com/api/v1/product/sub-category/';

  useEffect(() => {
    const fetchSubCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<ApiResponse>(`${API_BASE_URL}?page=${page + 1}&page_size=${rowsPerPage}`);
        setSubCategories(response.data.results);
        setTotalCount(response.data.count);
      } catch (err) {
        setError('Failed to fetch subcategories. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, [page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden', p: 2 }}>
      <Typography variant="h5" gutterBottom component="div" sx={{ mb: 2 }}>
        Subcategories
      </Typography>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subCategories.map((subCategory) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={subCategory.id}>
                <TableCell>{subCategory.id}</TableCell>
                <TableCell>{subCategory.name}</TableCell>
                <TableCell>{subCategory.category.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default AdminSubCategories;
