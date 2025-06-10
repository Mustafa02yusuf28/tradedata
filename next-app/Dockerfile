# Use the official Microsoft Playwright image which has all dependencies pre-installed
FROM mcr.microsoft.com/playwright/python:v1.44.0-jammy

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file from the build context into the container
COPY next-app/requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application code (specifically the scripts folder)
COPY next-app/scripts/ ./scripts/

# The command to run your application
CMD ["python", "scripts/scraper.py"] 