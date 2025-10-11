import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Save, ArrowBack } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { checklistService } from '../../services/checklist.service';

const checklistSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

type ChecklistFormData = z.infer<typeof checklistSchema>;

export const ChecklistForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const { data: checklist, isLoading: isLoadingChecklist } = useQuery({
    queryKey: ['checklist', id],
    queryFn: () => checklistService.getOne(id!),
    enabled: isEditMode,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChecklistFormData>({
    resolver: zodResolver(checklistSchema),
  });

  useEffect(() => {
    if (checklist) {
      reset(checklist);
    }
  }, [checklist, reset]);

  const createMutation = useMutation({
    mutationFn: checklistService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklists'] });
      navigate('/app/checklists');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ChecklistFormData) => checklistService.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checklists'] });
      queryClient.invalidateQueries({ queryKey: ['checklist', id] });
      navigate('/app/checklists');
    },
  });

  const onSubmit = async (data: ChecklistFormData) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync(data);
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (error) {
      console.error('Failed to save checklist:', error);
    }
  };

  if (isEditMode && isLoadingChecklist) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const mutation = isEditMode ? updateMutation : createMutation;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/app/checklists')} sx={{ mb: 2 }}>
          Back to Checklists
        </Button>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {isEditMode ? 'Edit Checklist' : 'Add New Checklist'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {isEditMode ? 'Update checklist information' : 'Add a new checklist to your system'}
        </Typography>
      </Box>

      {mutation.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to save checklist. Please try again.
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Checklist Details
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Name"
                  {...register('name')}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Description (Optional)"
                  multiline
                  rows={3}
                  {...register('description')}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            startIcon={<Save />}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Saving...' : isEditMode ? 'Update Checklist' : 'Add Checklist'}
          </Button>
          <Button variant="outlined" size="large" onClick={() => navigate('/app/checklists')}>
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  );
};
