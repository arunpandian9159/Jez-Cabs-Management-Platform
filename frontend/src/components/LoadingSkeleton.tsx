import React from 'react';
import { Box, Card, CardContent, Grid, Skeleton } from '@mui/material';

interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'table' | 'dashboard' | 'form';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'card',
  count = 6,
}) => {
  if (variant === 'dashboard') {
    return (
      <Box>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width={200} height={40} sx={{ mb: 1 }} />
          <Skeleton variant="text" width={300} height={24} />
        </Box>

        {/* KPI Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[1, 2, 3, 4].map((i) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Skeleton variant="circular" width={56} height={56} />
                  </Box>
                  <Skeleton variant="text" width="60%" height={40} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="80%" height={20} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="50%" height={16} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width={200} height={32} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width={150} height={32} sx={{ mb: 2 }} />
                <Skeleton variant="circular" width={200} height={200} sx={{ mx: 'auto' }} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }

  if (variant === 'form') {
    return (
      <Box>
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width={200} height={40} sx={{ mb: 1 }} />
          <Skeleton variant="text" width={300} height={24} />
        </Box>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Skeleton variant="text" width={150} height={28} sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              {[1, 2, 3, 4].map((i) => (
                <Grid size={{ xs: 12, md: 6 }} key={i}>
                  <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Skeleton variant="rectangular" width={120} height={42} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={100} height={42} sx={{ borderRadius: 1 }} />
        </Box>
      </Box>
    );
  }

  if (variant === 'table') {
    return (
      <Card>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <Skeleton variant="text" width={200} height={32} />
          </Box>
          {[...Array(count)].map((_, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
              <Skeleton variant="rectangular" width="30%" height={40} />
              <Skeleton variant="rectangular" width="25%" height={40} />
              <Skeleton variant="rectangular" width="20%" height={40} />
              <Skeleton variant="rectangular" width="15%" height={40} />
              <Skeleton variant="rectangular" width="10%" height={40} />
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (variant === 'list') {
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Skeleton variant="text" width={200} height={40} sx={{ mb: 1 }} />
            <Skeleton variant="text" width={250} height={24} />
          </Box>
          <Skeleton variant="rectangular" width={140} height={42} sx={{ borderRadius: 1 }} />
        </Box>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {[...Array(count)].map((_, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="70%" height={28} sx={{ mb: 0.5 }} />
                      <Skeleton variant="text" width="50%" height={20} />
                    </Box>
                    <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
                  </Box>
                  <Skeleton variant="text" width="90%" height={20} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="80%" height={20} sx={{ mb: 0.5 }} />
                  <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Skeleton variant="rectangular" height={36} sx={{ flex: 1, borderRadius: 1 }} />
                    <Skeleton variant="rectangular" width={40} height={36} sx={{ borderRadius: 1 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  // Default: card variant
  return (
    <Grid container spacing={3}>
      {[...Array(count)].map((_, i) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
          <Card>
            <CardContent>
              <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="80%" height={24} sx={{ mb: 2 }} />
              <Skeleton variant="rectangular" height={120} sx={{ mb: 2, borderRadius: 1 }} />
              <Skeleton variant="text" width="40%" height={28} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

