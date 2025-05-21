# Use a multi-stage build to reduce final image size (optional but recommended)
# Stage 1: Build stage
FROM python:3.9-slim AS builder

WORKDIR /app

# Copy requirements first to leverage Docker layer caching
COPY requirements.txt .
RUN pip install --user -r requirements.txt

# Stage 2: Final runtime image
FROM python:3.9-slim

WORKDIR /app

# Install required system packages
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Copy installed packages from builder stage
ENV PATH="/root/.local/bin:${PATH}"

# Copy source code
COPY . .

# Delete clientUI after copy (cleaner than complex COPY rules)
RUN rm -rf ClientUI/

# Install any system dependencies if needed (already handled in builder)
COPY --from=builder /root/.local /root/.local

# Expose port used by Gunicorn
EXPOSE 5000

# Command to run the app
CMD ["gunicorn", "-c", "gunicorn_conf.py", "wsgi:app"]