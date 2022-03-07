import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { UseFormReturn } from 'react-hook-form';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import * as URLS from 'config/urls';
import { setItem } from 'helpers/storage';
import { LOGIN } from 'graphql/mutations/login';
import Form from 'components/Form';
import TextField from 'components/TextField';

type FormValues = {
  email: string;
  password: string;
}

function renderFields(props: { loading: boolean }) {
  const { loading = false } = props;

  return (methods: UseFormReturn) => {
    return (
      <>
        <TextField
          label="Email"
          name="email"
          required
          fullWidth
          margin="dense"
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          required
          fullWidth
          margin="dense"
        />

        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          sx={{ boxShadow: 2, mt: 3 }}
          loading={loading}
          fullWidth
        >
          Login
        </LoadingButton>
      </>
    );
  }
}

function LoginForm() {
  const navigate = useNavigate();
  const [login, { loading }] = useMutation(LOGIN);

  const handleSubmit = async (values: any) => {
    const { data } = await login({
      variables: {
        input: values
      },
    });

    const { token } = data.login;

    setItem('token', token);

    navigate(URLS.FLOWS);
  };

  const render = React.useMemo(() => renderFields({ loading }), [loading]);

  return (
    <Paper sx={{ px: 2, py: 4 }}>
      <Typography
        variant="h3"
        align="center"
        sx={{ borderBottom: '1px solid', borderColor: (theme) => theme.palette.text.disabled, pb: 2, mb: 2 }}
        gutterBottom>
        Login
      </Typography>

      <Form onSubmit={handleSubmit} render={render} />
    </Paper>
  );
};

export default LoginForm;
