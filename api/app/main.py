import numpy as np
import pandas as pd
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sklearn.linear_model import LinearRegression

app = FastAPI()

app.add_middleware(CORSMiddleware,
allow_origins=["*"],
allow_credentials=True,
allow_methods=["*"],
allow_headers=["*"],)

@app.get("/")
async def root():
    return {"message": "hello"}

@app.get("/data")
async def create_linear_data(return_theta: bool = False):
    m = 50
    plus_minus = 1 if np.random.random() < 0.5 else -1
    X = np.random.randint(1,8) * np.random.rand(m, 1)
    y = (4 + 3 * X + np.random.randn(m, 1)) * plus_minus
    df = (
        pd.DataFrame(np.c_[np.ones((m, 1)), X, y], columns=['X_b','X','y'])
        .reset_index()
        .rename(columns={'index':'i'})
    )

    r = {'data': json.loads(df.to_json(orient='records'))}

    if return_theta:
        lr = LinearRegression()
        lr.fit(X,y)
        theta0_best, theta1_best = lr.intercept_[0], lr.coef_[0][0]
        r['theta0_best'] = theta0_best
        r['theta1_best'] = theta1_best
    
    return r