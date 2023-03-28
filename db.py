from sqlalchemy import create_engine
from sqlalchemy import MetaData, Table, Column, Integer, String


engine = create_engine('sqlite:///test.db')
meta = MetaData()
users = Table('users', meta,
              Column('id', Integer, primary_key=True),
              Column('name', String),
              Column('sign', String))
meta.create_all(engine)


class CRD:
    @staticmethod
    def insert(name, age):
        query = users.insert().values(name=name, age=age)
        conn = engine.connect()
        conn.execute(query)

    @staticmethod
    def select_all():
        query = users.select()
        conn = engine.connect()
        result = conn.execute(query)

        return result

    @staticmethod
    def delete(name):
        query = users.delete().where(users.c.name == name)
        conn = engine.connect()
        conn.execute(query)