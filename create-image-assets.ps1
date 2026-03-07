# PowerShell skript pro vytvoření chybějících image assets
# Používá .NET System.Drawing pro změnu velikosti obrázků

# Načtení .NET assembly pro práci s obrázky
Add-Type -AssemblyName System.Drawing

$imagesDir = "images"
$sourceHero = "$imagesDir\hero.jpg"
$sourceHeroMobile = "$imagesDir\hero-mobile.jpg"
$sourceLogo = "$imagesDir\Domecek.png"

# Funkce pro změnu velikosti obrázku
function Resize-Image {
    param(
        [string]$SourcePath,
        [string]$DestinationPath,
        [int]$Width,
        [int]$Height,
        [int]$Quality = 90
    )
    
    if (-not (Test-Path $SourcePath)) {
        Write-Warning "Zdrojový soubor neexistuje: $SourcePath"
        return $false
    }
    
    try {
        $image = [System.Drawing.Image]::FromFile($SourcePath)
        $bitmap = New-Object System.Drawing.Bitmap($Width, $Height)
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        
        # Nastavení kvality
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        
        # Vykreslení obrázku
        $graphics.DrawImage($image, 0, 0, $Width, $Height)
        
        # Uložení podle typu souboru
        $extension = [System.IO.Path]::GetExtension($DestinationPath).ToLower()
        
        if ($extension -eq ".png") {
            $bitmap.Save($DestinationPath, [System.Drawing.Imaging.ImageFormat]::Png)
        } elseif ($extension -eq ".jpg" -or $extension -eq ".jpeg") {
            $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
            $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
            $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $Quality)
            $bitmap.Save($DestinationPath, $encoder, $encoderParams)
        } else {
            $bitmap.Save($DestinationPath)
        }
        
        $graphics.Dispose()
        $bitmap.Dispose()
        $image.Dispose()
        
        Write-Host "Created: $DestinationPath ($Width x $Height)" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Error "Error creating $DestinationPath : $_"
        return $false
    }
}

# Funkce pro získání rozměrů obrázku
function Get-ImageDimensions {
    param([string]$ImagePath)
    
    try {
        $image = [System.Drawing.Image]::FromFile($ImagePath)
        $width = $image.Width
        $height = $image.Height
        $image.Dispose()
        return @{ Width = $width; Height = $height }
    }
    catch {
        return $null
    }
}

Write-Host "=== Creating missing image assets ===" -ForegroundColor Cyan
Write-Host ""

# Získání rozměrů zdrojových obrázků
$heroDims = Get-ImageDimensions $sourceHero
$heroMobileDims = Get-ImageDimensions $sourceHeroMobile
$logoDims = Get-ImageDimensions $sourceLogo

if (-not $heroDims) {
    Write-Error "Nelze načíst rozměry hero.jpg"
    exit 1
}

if (-not $heroMobileDims) {
    Write-Error "Nelze načíst rozměry hero-mobile.jpg"
    exit 1
}

if (-not $logoDims) {
    Write-Error "Nelze načíst rozměry Domecek.png"
    exit 1
}

Write-Host "Source image dimensions:" -ForegroundColor Yellow
Write-Host "  hero.jpg: $($heroDims.Width) x $($heroDims.Height)"
Write-Host "  hero-mobile.jpg: $($heroMobileDims.Width) x $($heroMobileDims.Height)"
Write-Host "  Domecek.png: $($logoDims.Width) x $($logoDims.Height)"
Write-Host ""

# Creating @2x versions of hero images
Write-Host "=== Creating @2x hero images ===" -ForegroundColor Cyan

# Hero desktop @2x
$hero2xWidth = $heroDims.Width * 2
$hero2xHeight = $heroDims.Height * 2
Resize-Image -SourcePath $sourceHero -DestinationPath "$imagesDir\hero@2x.jpg" -Width $hero2xWidth -Height $hero2xHeight -Quality 85

# Hero mobile @2x
$heroMobile2xWidth = $heroMobileDims.Width * 2
$heroMobile2xHeight = $heroMobileDims.Height * 2
Resize-Image -SourcePath $sourceHeroMobile -DestinationPath "$imagesDir\hero-mobile@2x.jpg" -Width $heroMobile2xWidth -Height $heroMobile2xHeight -Quality 85

Write-Host ""
Write-Host "=== Creating Apple Touch Icons ===" -ForegroundColor Cyan

# Apple Touch Icons z loga
Resize-Image -SourcePath $sourceLogo -DestinationPath "$imagesDir\apple-touch-icon-180x180.png" -Width 180 -Height 180
Resize-Image -SourcePath $sourceLogo -DestinationPath "$imagesDir\apple-touch-icon-152x152.png" -Width 152 -Height 152
Resize-Image -SourcePath $sourceLogo -DestinationPath "$imagesDir\apple-touch-icon-120x120.png" -Width 120 -Height 120

Write-Host ""
Write-Host "=== Creating PWA Icons ===" -ForegroundColor Cyan

# PWA Icons z loga
Resize-Image -SourcePath $sourceLogo -DestinationPath "$imagesDir\icon-192x192.png" -Width 192 -Height 192
Resize-Image -SourcePath $sourceLogo -DestinationPath "$imagesDir\icon-512x512.png" -Width 512 -Height 512

Write-Host ""
Write-Host "=== WebP files ===" -ForegroundColor Yellow
Write-Host "NOTE: PowerShell does not have native WebP support." -ForegroundColor Yellow
Write-Host "To create WebP files, use:" -ForegroundColor Yellow
Write-Host "  1. Online tool: https://cloudconvert.com/jpg-to-webp" -ForegroundColor Yellow
Write-Host "  2. cwebp tool from Google WebP tools" -ForegroundColor Yellow
Write-Host "  3. ImageMagick with WebP support" -ForegroundColor Yellow
Write-Host ""
Write-Host "Required WebP files:" -ForegroundColor Yellow
Write-Host "  - images/hero.webp (from hero.jpg)" -ForegroundColor Yellow
Write-Host "  - images/hero@2x.webp (from hero@2x.jpg)" -ForegroundColor Yellow
Write-Host "  - images/hero-mobile.webp (from hero-mobile.jpg)" -ForegroundColor Yellow
Write-Host "  - images/hero-mobile@2x.webp (from hero-mobile@2x.jpg)" -ForegroundColor Yellow
Write-Host ""

# Creating placeholder WebP files (copy JPG as temporary solution)
Write-Host "Creating placeholder WebP files (copying JPG as temporary solution)..." -ForegroundColor Yellow
Copy-Item $sourceHero "$imagesDir\hero.webp" -ErrorAction SilentlyContinue
Copy-Item "$imagesDir\hero@2x.jpg" "$imagesDir\hero@2x.webp" -ErrorAction SilentlyContinue
Copy-Item $sourceHeroMobile "$imagesDir\hero-mobile.webp" -ErrorAction SilentlyContinue
Copy-Item "$imagesDir\hero-mobile@2x.jpg" "$imagesDir\hero-mobile@2x.webp" -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "=== Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Created files:" -ForegroundColor Cyan
Get-ChildItem -Path $imagesDir -Filter "*@2x*" | ForEach-Object { Write-Host "  OK $($_.Name) ($([math]::Round($_.Length/1KB, 2)) KB)" }
Get-ChildItem -Path $imagesDir -Filter "apple-touch-icon-*" | ForEach-Object { Write-Host "  OK $($_.Name) ($([math]::Round($_.Length/1KB, 2)) KB)" }
Get-ChildItem -Path $imagesDir -Filter "icon-*" | ForEach-Object { Write-Host "  OK $($_.Name) ($([math]::Round($_.Length/1KB, 2)) KB)" }
Get-ChildItem -Path $imagesDir -Filter "*.webp" | ForEach-Object { Write-Host "  WARNING $($_.Name) (placeholder - needs conversion to real WebP)" -ForegroundColor Yellow }
