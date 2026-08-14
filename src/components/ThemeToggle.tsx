import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Moon, Sparkles, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme !== 'light';
  const nextTheme = isDark ? 'light' : 'dark';
  const label = mounted ? `Switch to ${nextTheme} mode` : 'Change color theme';

  return (
    <motion.button
      type="button"
      className="theme-toggle"
      onClick={() => mounted && setTheme(nextTheme)}
      whileHover={{ y: -2, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      aria-label={label}
      title={label}
    >
      {!mounted ? (
        <Sparkles className="w-4 h-4" />
      ) : isDark ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
      <span>{mounted ? `${nextTheme[0].toUpperCase()}${nextTheme.slice(1)} mode` : 'Theme'}</span>
    </motion.button>
  );
}
