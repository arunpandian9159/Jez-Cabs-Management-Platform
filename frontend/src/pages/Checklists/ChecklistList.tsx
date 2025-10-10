import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { Add, CheckCircle, Cancel, Checklist as ChecklistIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { checklistService } from '../../services/checklist.service';
import { Checklist } from '../../types';
import { format } from 'date-fns';

export const ChecklistList: React.FC = () => {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['checklists'],
    queryFn: () => checklistService.getAll(),
  });

  const checklists = data?.data;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Failed to load checklists. Please try again later.</Alert>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Checklists
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Vehicle inspection and maintenance checklists
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/checklists/new')}
          size="large"
        >
          New Checklist
        </Button>
      </Box>

      {checklists && checklists.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <ChecklistIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No checklists found
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Get started by creating your first checklist
            </Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/checklists/new')}>
              New Checklist
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {checklists?.map((checklist: Checklist) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={checklist._id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Typography variant="h6" fontWeight={700}>
                      {checklist.templateName}
                    </Typography>
                    {checklist.isComplete ? (
                      <Chip icon={<CheckCircle />} label="Complete" color="success" size="small" />
                    ) : (
                      <Chip label="Incomplete" color="warning" size="small" />
                    )}
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    {checklist.isApproved === true && (
                      <Chip icon={<CheckCircle />} label="Approved" color="success" size="small" />
                    )}
                    {checklist.isApproved === false && (
                      <Chip icon={<Cancel />} label="Rejected" color="error" size="small" />
                    )}
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Items: {checklist.items.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Created: {format(new Date(checklist.createdAt), 'MMM dd, yyyy')}
                  </Typography>

                  {checklist.rejectionReason && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {checklist.rejectionReason}
                    </Alert>
                  )}

                  {checklist.notes && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      {checklist.notes}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
