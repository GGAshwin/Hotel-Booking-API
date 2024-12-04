#!/bin/bash

kubectl port-forward service/auth-service 3000:80 -n nodejs-services &
kubectl port-forward service/payments-service 3001:80 -n nodejs-services &
kubectl port-forward service/feedback-service 3002:80 -n nodejs-services &
wait
