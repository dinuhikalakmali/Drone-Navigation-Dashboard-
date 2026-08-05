
//Install this
npm install nodemailer

// Users
✅ Created: supervisor1@test.com (project supervisor)
✅ Created: qualitymanager1@test.com (quality manager)
✅ Created: admin1@test.com (admin)
✅ Created: siteengineer2@test.com (site engineer)

 // Add users
$users = @(
    @{
        name     = "Site Engineer 1"
        email    = "siteengineer1@test.com"
        password = "123456"
        type     = "site engineer"
    },
    @{
        name     = "Project Supervisor 1"
        email    = "supervisor1@test.com"
        password = "123456"
        type     = "project supervisor"
    },
    @{
        name     = "Quality Manager 1"
        email    = "qualitymanager1@test.com"
        password = "123456"
        type     = "quality manager"
    },
    @{
        name     = "Admin 1"
        email    = "admin1@test.com"
        password = "123456"
        type     = "admin"
    },
    @{
        name     = "Site Engineer 2"
        email    = "siteengineer2@test.com"
        password = "123456"
        type     = "site engineer"
    }
)

foreach ($user in $users) {
    $body = $user | ConvertTo-Json
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
            -Method POST `
            -ContentType "application/json" `
            -Body $body
        Write-Host "✅ Created: $($user.email) ($($user.type))" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Failed: $($user.email) → $($_.Exception.Message)" -ForegroundColor Red
    }
}