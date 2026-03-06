# PowerShell skript pro vytvoření nové desktop hero varianty s lepším cropem
# Cíl: Vytvořit landscape variantu (1920px × 1080px) která zahrnuje židli vlevo dole

Add-Type -AssemblyName System.Drawing

$imagesDir = "images"
$sourceHero = "$imagesDir\hero.jpg"

# Funkce pro crop a resize obrázku s kontrolou zdrojového rozsahu
function Create-DesktopHero {
    param(
        [string]$SourcePath,
        [string]$DestinationPath,
        [int]$TargetWidth = 1920,
        [int]$TargetHeight = 1080,
        [int]$Quality = 85
    )
    
    if (-not (Test-Path $SourcePath)) {
        Write-Warning "Zdrojový soubor neexistuje: $SourcePath"
        return $false
    }
    
    try {
        $sourceImage = [System.Drawing.Image]::FromFile($SourcePath)
        $sourceWidth = $sourceImage.Width
        $sourceHeight = $sourceImage.Height
        
        Write-Host "Zdrojový obrázek: ${sourceWidth}px × ${sourceHeight}px" -ForegroundColor Yellow
        
        # Vypočítat poměr stran
        $sourceRatio = $sourceWidth / $sourceHeight
        $targetRatio = $TargetWidth / $TargetHeight
        
        Write-Host "Poměr zdroje: $([math]::Round($sourceRatio, 2))" -ForegroundColor Yellow
        Write-Host "Poměr cíle: $([math]::Round($targetRatio, 2))" -ForegroundColor Yellow
        
        # Pro landscape crop z portrétního obrázku:
        # Musíme vzít část obrázku, která má landscape poměr
        # A upravit crop tak, aby zahrnoval dolní část (kde by mohla být židle)
        
        $cropWidth = $sourceWidth
        $cropHeight = [math]::Round($sourceWidth / $targetRatio)
        
        # Pokud je zdrojový obrázek vyšší než potřebujeme, můžeme vybrat část
        if ($cropHeight -le $sourceHeight) {
            # Máme dostatek výšky - můžeme vybrat část která zahrnuje dolní část
            # Crop zahrnuje více dolní části obrázku (kde by mohla být židle)
            $cropY = $sourceHeight - $cropHeight  # Začínáme od spodu nahoru
            Write-Host "Crop: ${cropWidth}px × ${cropHeight}px z pozice Y=$cropY" -ForegroundColor Cyan
            Write-Host "Toto zahrnuje dolní část obrázku (kde by mohla být židle)" -ForegroundColor Cyan
        } else {
            # Zdrojový obrázek není dostatečně vysoký - použijeme celou výšku
            $cropHeight = $sourceHeight
            $cropWidth = [math]::Round($sourceHeight * $targetRatio)
            $cropY = 0
            Write-Host "Crop: ${cropWidth}px × ${cropHeight}px (celá výška)" -ForegroundColor Cyan
            Write-Host "UPOZORNĚNÍ: Zdrojový obrázek nemá dostatečnou výšku pro ideální landscape crop" -ForegroundColor Yellow
        }
        
        # Vytvořit bitmap pro crop
        $cropBitmap = New-Object System.Drawing.Bitmap($cropWidth, $cropHeight)
        $cropGraphics = [System.Drawing.Graphics]::FromImage($cropBitmap)
        $cropGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $cropGraphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $cropGraphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $cropGraphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        
        # Vykreslit crop z původního obrázku
        $cropRect = New-Object System.Drawing.Rectangle(0, $cropY, $cropWidth, $cropHeight)
        $cropGraphics.DrawImage($sourceImage, 0, 0, $cropRect, [System.Drawing.GraphicsUnit]::Pixel)
        
        $cropGraphics.Dispose()
        
        # Nyní resize crop na cílovou velikost
        $targetBitmap = New-Object System.Drawing.Bitmap($TargetWidth, $TargetHeight)
        $targetGraphics = [System.Drawing.Graphics]::FromImage($targetBitmap)
        $targetGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $targetGraphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $targetGraphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $targetGraphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        
        $targetGraphics.DrawImage($cropBitmap, 0, 0, $TargetWidth, $TargetHeight)
        $targetGraphics.Dispose()
        
        # Uložit jako JPG
        $encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $Quality)
        $targetBitmap.Save($DestinationPath, $encoder, $encoderParams)
        
        $cropBitmap.Dispose()
        $targetBitmap.Dispose()
        $sourceImage.Dispose()
        
        Write-Host "Vytvořeno: $DestinationPath (${TargetWidth}px × ${TargetHeight}px)" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Error "Chyba při vytváření $DestinationPath : $_"
        return $false
    }
}

Write-Host "=== Vytváření nové desktop hero varianty ===" -ForegroundColor Cyan
Write-Host ""

# Vytvořit novou desktop variantu
$desktopHero = "$imagesDir\hero-desktop-new.jpg"
$success = Create-DesktopHero -SourcePath $sourceHero -DestinationPath $desktopHero -TargetWidth 1920 -TargetHeight 1080 -Quality 85

if ($success) {
    Write-Host ""
    Write-Host "=== Vytváření @2x varianty ===" -ForegroundColor Cyan
    $desktopHero2x = "$imagesDir\hero-desktop-new@2x.jpg"
    Create-DesktopHero -SourcePath $sourceHero -DestinationPath $desktopHero2x -TargetWidth 3840 -TargetHeight 2160 -Quality 85
    
    Write-Host ""
    Write-Host "=== Dokončeno ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "Vytvořené soubory:" -ForegroundColor Cyan
    Get-ChildItem -Path $imagesDir -Filter "hero-desktop-new*" | ForEach-Object { 
        $sizeKB = [math]::Round($_.Length/1KB, 2)
        Write-Host "  $($_.Name) ($sizeKB KB)" -ForegroundColor Green
    }
    Write-Host ""
    Write-Host "UPOZORNĚNÍ:" -ForegroundColor Yellow
    Write-Host "  - Nové soubory jsou připraveny jako hero-desktop-new.jpg a hero-desktop-new@2x.jpg" -ForegroundColor Yellow
    Write-Host "  - Pokud jsou výsledky uspokojivé, přejmenujte je na hero.jpg a hero@2x.jpg" -ForegroundColor Yellow
    Write-Host "  - Pokud aktuální hero.jpg už nemá židli (byla oříznuta), nelze ji vrátit bez původního zdroje" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "Chyba při vytváření desktop hero varianty" -ForegroundColor Red
}
