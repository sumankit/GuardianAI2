"""
GuardianAI — Logger
Colored console output + rotating file logs.
"""

import logging
import os
from pathlib import Path

import colorlog


def setup_logger(name: str = "guardianai", log_level: str = "INFO", log_file: str = "logs/guardianai.log") -> logging.Logger:
    Path(log_file).parent.mkdir(parents=True, exist_ok=True)

    logger = logging.getLogger(name)
    logger.setLevel(getattr(logging, log_level.upper(), logging.INFO))

    if logger.handlers:
        return logger

    # ── Console handler (colored) ──────────────────────────────
    console_handler = colorlog.StreamHandler()
    console_handler.setLevel(logging.DEBUG)
    console_handler.setFormatter(
        colorlog.ColoredFormatter(
            "%(log_color)s[%(asctime)s] %(levelname)-8s%(reset)s %(name)s | %(message)s",
            datefmt="%H:%M:%S",
            log_colors={
                "DEBUG": "cyan",
                "INFO": "green",
                "WARNING": "yellow",
                "ERROR": "red",
                "CRITICAL": "bold_red",
            },
        )
    )

    # ── File handler ───────────────────────────────────────────
    file_handler = logging.FileHandler(log_file, encoding="utf-8")
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(
        logging.Formatter(
            "[%(asctime)s] %(levelname)-8s %(name)s | %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
    )

    logger.addHandler(console_handler)
    logger.addHandler(file_handler)
    logger.propagate = False

    return logger


# Module-level logger used across the app
logger = setup_logger()
