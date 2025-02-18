import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Button,
  Container,
  TextField,
  IconButton,
  Typography,
  CssBaseline,
  useMediaQuery,
  ThemeProvider,
  Chip,
} from '@mui/material';
import { Sun, Moon, Pause, Play, Eraser } from 'lucide-react';
import { lightTheme, darkTheme } from './theme';

const suggestions = [
  'Ok google, Enciende aire acondicionado oficina',
  'Ok google, Apaga aire acondicionado oficina',
  'Ok google, Enciende aire acondicionado pieza',
  'Ok google, Apaga aire acondicionado pieza',
  'Ok google, Enciende aire acondicionado living',
  'Ok google, Apaga aire acondicionado living',
  'Ok google, Enciende tele oficina',
  'Ok google, Apaga tele oficina',
  'Ok google, Enciende lampara oficina',
  'Ok google, Apaga lampara oficina',
  'Ok google, Enciende luz dormitorio',
  'Ok google, Apaga luz dormitorio',
  'Ok google, Enciende luz cocina',
  'Ok google, Apaga luz cocina',
  'Ok google, Enciende luz comedor',
  'Ok google, Apaga luz comedor',
];

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [text, setText] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

  useEffect(() => {
    setSpeechSynthesis(window.speechSynthesis);
  }, []);

  const handleSpeak = () => {
    if (!speechSynthesis) return; 
    if (speaking) {
      speechSynthesis.pause();
    } else if (utterance) {
      speechSynthesis.resume();
    } else {
      const newUtterance = new SpeechSynthesisUtterance(text);
      setUtterance(newUtterance);
      newUtterance.onend = () => {
        setSpeaking(false);
        setUtterance(null);
      };
      speechSynthesis.speak(newUtterance);
    }
    setSpeaking(!speaking);
    
  };

  const stopSpeaking = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setSpeaking(false);
      setUtterance(null);
    }
  };

  const renderChip = (suggestion: string) => (
    <Chip
      sx={{
        height: 'auto',
        '& .MuiChip-label': {
          display: 'block',
          whiteSpace: 'normal',
        },
      }}
      label={suggestion}
      onClick={() => setText(suggestion)}
    />
  );

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            py: 4,
            gap: 3,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4" component="h1" gutterBottom>
                Texto a Voz
              </Typography>
              <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
                {darkMode ? <Sun size={24} /> : <Moon size={24} />}
              </IconButton>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              label="Ingresa texto para convertir a voz"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-start' }}>
              <Button
                variant="contained"
                startIcon={speaking ? <Pause /> : <Play />}
                onClick={handleSpeak}
                disabled={!text}
              >
                {speaking ? 'Pausa' : 'Hablar'}
              </Button>
              {speaking && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={stopSpeaking}
                >
                  Detener
                </Button>
              )}
              <Button
                variant="contained"
                startIcon={<Eraser />}
                onClick={() => setText('')}
                disabled={!text}
              >
                {'Limpiar'}
              </Button>
            </Box>
          </Paper>

          <Paper
            elevation={3}
            sx={{ p: 3 }}
          >
            <Typography variant="h6" gutterBottom>
              Sugerencias
            </Typography>
            <Typography variant="body1">
              {suggestions.map(renderChip)}
            </Typography>
          </Paper>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Instrucciones
            </Typography>
            <Typography variant="body1">
              1. Ingrese el texto que quiera convertir a voz
              <br />
              2. Click en el botón "Hablar" para iniciar la conversación de texto a voz
              <br />
              3. Use el botón pausar/reproducir para pausar o reanudar la conversación
              <br />
              4. Click en el icono sol/luna para elegir entre modo claro o modo oscuro
            </Typography>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;