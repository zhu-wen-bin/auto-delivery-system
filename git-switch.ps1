# Git 账号切换脚本
# 用法: .\git-switch.ps1 personal  或  .\git-switch.ps1 work

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("personal", "work")]
    [string]$Profile
)

# 定义账号配置
$profiles = @{
    "personal" = @{
        "name" = "liucong_dev"
        "email" = "741128958@qq.com"
    }
    "work" = @{
        "name" = "你的工作用户名"
        "email" = "你的工作邮箱@company.com"
    }
}

# 应用配置
$selected = $profiles[$Profile]
git config user.name $selected.name
git config user.email $selected.email

Write-Host "✅ Git 账号已切换到: $Profile" -ForegroundColor Green
Write-Host "   用户名: $($selected.name)"
Write-Host "   邮箱: $($selected.email)"
