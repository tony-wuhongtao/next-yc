#!/bin/bash

# 前置文件确认提示
echo -e "\n\033[33m[重要提示] 请确认最新版已经拷贝到当前目录！\033[0m"
read -p "确认文件已存在？(按回车继续，输入n取消) " file_confirm
if [[ "$file_confirm" == "n" ]]; then
    echo -e "\033[31m操作已取消\033[0m"
    exit 0
fi

# 检查root权限
if [[ $EUID -ne 0 ]]; then
    echo -e "\033[31m错误：该脚本必须使用root权限运行\033[0m"
    echo "请尝试使用 sudo $0 或切换至root用户"
    exit 1
fi

# 打印彩色步骤提示
function print_step() {
    echo -e "\n\033[34m>>> 步骤$1：$2\033[0m"
}

# 用户输入校验
read -p "请输入镜像标签版本号（如0.1.01）：" TAG
if [[ -z "$TAG" ]]; then
    echo -e "\033[31m错误：必须输入版本标签\033[0m"
    exit 1
fi

# 步骤1：构建镜像
print_step 1 "开始构建Docker镜像 next-yc:${TAG}"
docker build -t next-yc:${TAG} .
if [[ $? -ne 0 ]]; then
    echo -e "\033[31m镜像构建失败，请检查以下可能原因："
    echo "1. Dockerfile 是否存在"
    echo "2. 文件权限是否正确"
    echo "3. 网络连接是否正常\033[0m"
    exit 1
fi
read -p "镜像构建完成，按回车继续下一步（输入n退出）: " confirm
[[ $confirm == "n" ]] && exit

# 步骤2：停止并删除旧容器
print_step 2 "清理旧容器"
if docker inspect next &> /dev/null; then
    docker stop next 
    echo "已停止旧容器"
    docker rm next 
    echo "已删除旧容器"
else
    echo "未找到运行中的next容器"
fi
read -p "旧容器清理完成，按回车继续下一步（输入n退出）: " confirm
[[ $confirm == "n" ]] && exit

# 步骤3：启动新容器
print_step 3 "启动新容器"
#docker run --env-file .env -d --name next -p 3000:3000 next-yc:${TAG}
docker run --env-file .env -d -p 3000:3000 -v /data/next/db/dev.db:/app/prisma/dev.db --name next next-yc:${TAG}

if [[ $? -ne 0 ]]; then
    echo -e "\033[31m容器启动失败，常见原因："
    echo "1. 8080端口已被占用"
    echo "2. 内存资源不足"
    echo "3. 镜像标签输入错误\033[0m"
    exit 1
fi
read -p "新容器已启动，按回车查看运行日志（输入n退出）: " confirm
[[ $confirm == "n" ]] && exit

# 步骤4：查看实时日志
print_step 4 "查看容器日志（最近1000行，Ctrl+C退出查看）"
docker logs -f -t --tail 1000 next 

echo -e "\n\033[32m[部署成功] 服务已正常启动！\033[0m"
echo "可通过以下命令验证服务状态："
echo -e "\033[36mdocker ps -a\033[0m"
